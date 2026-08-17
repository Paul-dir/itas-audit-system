# Integration Testing

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

## 1. Testcontainers Strategy

We rely on **Testcontainers** to spin up real Docker instances of our dependencies during integration testing. We do not use H2 in-memory databases because H2 does not support all advanced PostgreSQL features (like `JSONB`).

### Backend Database Testing
All JPA Adapter tests must use the PostgreSQL Testcontainer:

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
public class AuditCaseRepositoryAdapterTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @DynamicPropertySource
    static void registerPgProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    // ... tests ...
}
```

## 2. API Contract Testing
When testing REST Controllers, use `@WebMvcTest` with mocked Application Services. 

```java
@WebMvcTest(AuditCaseController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for pure MVC testing
public class AuditCaseControllerTest {
    // Inject MockMvc and test JSON serialization/deserialization
}
```
