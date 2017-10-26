import {graphql} from 'react-relay';

const hej = 123;

const query = graphql`
    query WelcomeScreenQuery {
      pokemon(id: 2) {
        name
      }
    }
  `;
