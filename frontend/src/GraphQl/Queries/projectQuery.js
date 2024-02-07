import { gql } from "@apollo/client";


export const GET_ALL_PROJECTS = gql`
  query getAllProjects {
    getAllProjects {
      id
      name
      status
    }
  }
`

export const GET_ONE_PROJECT = gql`
  query getOneProject($id: ID!) {
    getOneProject(id: $id) {
      id
      name
      description
      status
      user {
        id
        name
        email
        phone
      }
    }
  }
`