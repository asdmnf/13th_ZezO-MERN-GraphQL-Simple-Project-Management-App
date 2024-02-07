import { gql } from "@apollo/client";


export const GET_ALL_USERS = gql`
  query getAllUsers {
    getAllUsers {
      id
      name
      email
      phone
    }
  }
`;

export const GET_ONE_USER = gql`
  query getOneUser($id: ID!) {
    getOneUser(id: $id) {
      id
      name
      email
      phone
      projects {
        id
        name
        status
      }
    }
  }
`
