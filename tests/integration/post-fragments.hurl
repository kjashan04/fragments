# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
#Authorization: Bearer eyJraWQiOiIxMDdKRVRLdEIyQWlLQzlOM3VueHBMRWF0R3QrSVR0aEZMb0RZVVZaNlNjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRVYxV05OUzgxamdRXzVxSXByeVMtQSIsInN1YiI6Ijk0NzhmNDQ4LWEwMjEtNzAxNy00MmVjLTdjNDhmMDc3MDEyYyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9uWGlSdFBRamsiLCJjb2duaXRvOnVzZXJuYW1lIjoiamFzcyIsIm9yaWdpbl9qdGkiOiIzYWRhNGEzNy1iNTdmLTRiYmUtOTA0OS0zMDFlYTk1NzIyZjgiLCJhdWQiOiI0ZWIwb28xNm9oZG9odTFwMWViZm5pYnVybSIsImV2ZW50X2lkIjoiMDNlNTYwZTgtNzQ3My00YjAzLThiYjEtM2U5MWQxMzljZWM5IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NTQyOTU2MzMsImV4cCI6MTc1NDI5OTIzMywiaWF0IjoxNzU0Mjk1NjMzLCJqdGkiOiI2NWNhYTdhOS03MzRkLTQwNWUtYjI4ZC00NmFmN2E0ODUwZjQiLCJlbWFpbCI6ImtqYXNoYW4yNzhAZ21haWwuY29tIn0.iDnetVbA0b6SEyB4fEeIeScAzG0ltVqKNxcRjnTUQabggbwFMZ3fH9endiiRFFjqXqvLwQiO0g-qDxw1nremqjXNKjUUoRF-oLu0lRocH9PHNwHw7AcZaO6gg8SakHCf-5yaC8EBMNVIcGjBj5gSGDsHy1EWfB-9AGyGt_S2IL4EBU_DiHkNMZEopnwscCVWmAsn_GC8xNRpxZ8AiJJkKgapNKsIRy0qqRNfz0MQ1tg8gy6fAFbHDsAwieO_FhCf40lPc35ijWtUpFyHbk3TmcbrJ3Edzu_yo1De-o9lef9_z6HbWrHuwOg9RLHa8xyYIq66qYWNtqzPWrl5XFUj7A

# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.fragment.size" == 19
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1
#Authorization: Bearer eyJraWQiOiIxMDdKRVRLdEIyQWlLQzlOM3VueHBMRWF0R3QrSVR0aEZMb0RZVVZaNlNjPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRVYxV05OUzgxamdRXzVxSXByeVMtQSIsInN1YiI6Ijk0NzhmNDQ4LWEwMjEtNzAxNy00MmVjLTdjNDhmMDc3MDEyYyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9uWGlSdFBRamsiLCJjb2duaXRvOnVzZXJuYW1lIjoiamFzcyIsIm9yaWdpbl9qdGkiOiIzYWRhNGEzNy1iNTdmLTRiYmUtOTA0OS0zMDFlYTk1NzIyZjgiLCJhdWQiOiI0ZWIwb28xNm9oZG9odTFwMWViZm5pYnVybSIsImV2ZW50X2lkIjoiMDNlNTYwZTgtNzQ3My00YjAzLThiYjEtM2U5MWQxMzljZWM5IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NTQyOTU2MzMsImV4cCI6MTc1NDI5OTIzMywiaWF0IjoxNzU0Mjk1NjMzLCJqdGkiOiI2NWNhYTdhOS03MzRkLTQwNWUtYjI4ZC00NmFmN2E0ODUwZjQiLCJlbWFpbCI6ImtqYXNoYW4yNzhAZ21haWwuY29tIn0.iDnetVbA0b6SEyB4fEeIeScAzG0ltVqKNxcRjnTUQabggbwFMZ3fH9endiiRFFjqXqvLwQiO0g-qDxw1nremqjXNKjUUoRF-oLu0lRocH9PHNwHw7AcZaO6gg8SakHCf-5yaC8EBMNVIcGjBj5gSGDsHy1EWfB-9AGyGt_S2IL4EBU_DiHkNMZEopnwscCVWmAsn_GC8xNRpxZ8AiJJkKgapNKsIRy0qqRNfz0MQ1tg8gy6fAFbHDsAwieO_FhCf40lPc35ijWtUpFyHbk3TmcbrJ3Edzu_yo1De-o9lef9_z6HbWrHuwOg9RLHa8xyYIq66qYWNtqzPWrl5XFUj7A

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 19
[Asserts]
body == "This is a fragment!"
