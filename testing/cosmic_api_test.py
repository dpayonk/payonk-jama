import unittest
import requests
import json


class TestCosmicAPI(unittest.TestCase):

    def test_endpoint(self):
        url = "https://graphql.cosmicjs.com/v2"
        headers = {
            'content-type': 'application/json', 
            'Authorization': 'Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbm5pc0BwYXlvbmsuY29tIiwicGFzc3dvcmQiOiJhMjYyZjVkMTk5ZjgzMTc1ZGNlMGQzYmY5N2UyYmVjNiIsImlhdCI6MTYwOTgwMjA1MH0.txSwmn3rthvWfcqFW4cbNr0neyIA04dSaBUoX0LRYTg>'
            }

        query = """{
            getObjects(
                bucket_slug: "payonk-jama",
                input: { 
                type: "posts"
                }
            ) {
                objects {
                title
                    slug
                }
            }
            }
        """   
        query = """
        query MyQuery {
            getUsers(bucket_slug: "payonk-jama") {
                _id
                avatar_url
                bio
                company
                email
                first_name
                github
                last_name
                linkedin
                location
                role
                twitter
                username
                website
                write_key
            }
        }
        """
        response = requests.post(url, headers=headers, data = json.dumps({'query': query}))
        print(response)
        response_message = response.json()
        print(response_message)
