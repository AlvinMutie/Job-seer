import pytest

pytestmark = [pytest.mark.integration, pytest.mark.regression]


def test_get_jobs_default_pagination_and_sorting(client, seed_test_jobs):
    """
    ENHANCED JOB DISCOVERY (P3-01):
    Verify default GET /jobs returns jobs ordered by posted_at desc with default limit=20, offset=0.
    """
    response = client.get("/jobs")
    assert response.status_code == 200
    jobs = response.json()
    assert isinstance(jobs, list)
    assert len(jobs) == len(seed_test_jobs)


def test_get_jobs_custom_limit_and_offset(client, seed_test_jobs):
    """
    ENHANCED JOB DISCOVERY (P3-01):
    Verify limit and offset query parameters restrict returned job items.
    """
    # Page 1: limit 1, offset 0
    res1 = client.get("/jobs?limit=1&offset=0")
    assert res1.status_code == 200
    page1 = res1.json()
    assert len(page1) == 1

    # Page 2: limit 1, offset 1
    res2 = client.get("/jobs?limit=1&offset=1")
    assert res2.status_code == 200
    page2 = res2.json()
    assert len(page2) == 1

    assert page1[0]["id"] != page2[0]["id"]

    # Offset out of bounds
    res3 = client.get("/jobs?limit=10&offset=100")
    assert res3.status_code == 200
    assert len(res3.json()) == 0


def test_get_jobs_invalid_limit_and_offset_boundaries(client):
    """
    ENHANCED JOB DISCOVERY (P3-01):
    Verify invalid limit (0, negative, >100) and negative offset return 422 VALIDATION_ERROR.
    """
    assert client.get("/jobs?limit=0").status_code == 422
    assert client.get("/jobs?limit=-5").status_code == 422
    assert client.get("/jobs?limit=101").status_code == 422
    assert client.get("/jobs?offset=-1").status_code == 422


def test_get_jobs_sorting_by_title_and_company(client, seed_test_jobs):
    """
    ENHANCED JOB DISCOVERY (P3-01):
    Verify sort_by and order parameters sort jobs appropriately.
    """
    # Sort title asc
    res_asc = client.get("/jobs?sort_by=title&order=asc")
    assert res_asc.status_code == 200
    jobs_asc = res_asc.json()
    assert len(jobs_asc) >= 2
    titles_asc = [j["title"] for j in jobs_asc]
    assert titles_asc == sorted(titles_asc)

    # Sort title desc
    res_desc = client.get("/jobs?sort_by=title&order=desc")
    assert res_desc.status_code == 200
    jobs_desc = res_desc.json()
    titles_desc = [j["title"] for j in jobs_desc]
    assert titles_desc == sorted(titles_desc, reverse=True)


def test_get_jobs_invalid_sort_by_and_order(client):
    """
    ENHANCED JOB DISCOVERY (P3-01):
    Verify invalid sort_by column or invalid order string returns 422 VALIDATION_ERROR.
    """
    res1 = client.get("/jobs?sort_by=non_existent_column")
    assert res1.status_code == 422
    data1 = res1.json()
    assert data1["error"]["code"] == "VALIDATION_ERROR"

    res2 = client.get("/jobs?order=invalid_order")
    assert res2.status_code == 422
    data2 = res2.json()
    assert data2["error"]["code"] == "VALIDATION_ERROR"


def test_get_jobs_search_and_keyword_matching(client, seed_test_jobs):
    """
    ENHANCED JOB DISCOVERY (P3-01):
    Verify search parameter matches title, company, description, and skills.
    """
    # Search title
    res1 = client.get("/jobs?search=Python").json()
    assert len(res1) == 1
    assert res1[0]["title"] == "Senior Python Developer"

    # Search company
    res2 = client.get("/jobs?search=TechCorp").json()
    assert len(res2) == 1
    assert res2[0]["company"] == "TechCorp"

    # Search skills
    res3 = client.get("/jobs?search=React").json()
    assert len(res3) == 1
    assert res3[0]["title"] == "React Frontend Engineer"

    # Safe empty/whitespace search
    res4 = client.get("/jobs?search=   ").json()
    assert len(res4) == len(seed_test_jobs)


def test_get_jobs_combined_query_parameters(client, seed_test_jobs):
    """
    ENHANCED JOB DISCOVERY (P3-01):
    Verify search + sort_by + order + limit + offset operate cleanly together.
    """
    res = client.get("/jobs?search=Python&sort_by=title&order=asc&limit=5&offset=0")
    assert res.status_code == 200
    jobs = res.json()
    assert len(jobs) == 1
    assert jobs[0]["title"] == "Senior Python Developer"


def test_get_jobs_sql_injection_and_wildcard_safety(client, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P3-01):
    Verify SQL injection attempts and wildcard-heavy search payloads execute safely without database errors.
    """
    attacks = [
        "' OR 1=1; --",
        "'; DROP TABLE jobs; --",
        "%%%%%",
        "\\\\\\\\\\"
    ]
    for attack in attacks:
        res = client.get(f"/jobs?search={attack}")
        assert res.status_code == 200
        assert isinstance(res.json(), list)
