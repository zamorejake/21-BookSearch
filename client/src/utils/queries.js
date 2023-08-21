import { gql } from "@apollo/client";

export const GET_ME = gql`
  query users {
    users {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
