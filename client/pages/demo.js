import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`
  query {
    demo
  }
`;

const Demo = props => {
  return (
    <Query query={query}>
      {({ data, loading, error }) => {
        const { demo } = data;
        return <span>{demo}</span>;
      }}
    </Query>
  );
};

export default Demo;
