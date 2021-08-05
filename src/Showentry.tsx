import React  from "react";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import { Alert } from "react-bootstrap";

// test only query;
const GETENTRY_QUERY = gql`
query($id: Float!){
    allEntry(id: $id){
        edges{
            node{
                createdtime
                entry
            }
        }
    }
}`;

function Entries(){
    // test only;
    let fetch_id =1;
    const {loading, error, data} = useQuery(GETENTRY_QUERY, {variables: {id:fetch_id}});
    if(loading) return <p>Please wait...</p>;
    if(error) return <Alert>Something went wrong... {error.message}</Alert>;
    const entries = data.allEntry.edges;

    return (
        <div>
            <h1>💁‍今までの気持ち💁‍</h1>
            {
                entries.map((entry:any)=> {
                    return <h2>{entry.node.createdtime} - {entry.node.entry}</h2>
                })
            }
        </div>
    )
}

export default Entries;