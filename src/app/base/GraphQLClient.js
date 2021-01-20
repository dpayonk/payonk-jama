

// [Reference Design](https://graphql.org/graphql-js/graphql-clients/)
class GraphQLClient {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
    }

    async executeQuery(query, variables) {
        // var dice = 3; // var sides = 6;
        // var query = `query RollDice($dice: Int!, $sides: Int) {
        //     rollDice(numDice: $dice, numSides: $sides)
        //   }`;
        try {
            let response = await fetch('/graphql', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables,
                })
            });
                
            if (response.status === 200) {
                let jsonResponse = await response.json();
                let data = jsonResponse.get('data');
                return data;            
            } else {
                let jsonResponse = await response.json();
                let errors = jsonResponse.get('errors');
                // throw a dataError
                return errors;
            }
        } catch (error) {
            console.log(`Throw a ClientSideError`)
        }        
    }
}