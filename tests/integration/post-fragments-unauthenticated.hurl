# POST /v1/fragments without Authorization header should return 401 Unauthorized

POST http://localhost:8080/v1/fragments
Content-Type: text/plain

`This fragment is unauthenticated.`

HTTP/1.1 401

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Unauthorized"
