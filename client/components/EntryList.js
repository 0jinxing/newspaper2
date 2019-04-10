import { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { List } from 'antd';
import EntryListItem from '../components/EntryListItem';

const ALL_ENTRIES = gql`
  query AllEntries($offset: Int, $limit: Int) {
    allEntries(offset: $offset, limit: $limit) {
      count
      rows {
        id
        link
        title
        summary
      }
    }
  }
`;

const ENTRY_LIST_OF_SITE = gql`
  query EntryListOfSite($siteId: Int!, $offset: Int, $limit: Int) {
    entryListOfSite(siteId: $siteId, offset: $offset, limit: $limit) {
      count
      rows {
        id
        link
        title
        summary
      }
    }
  }
`;

const queryMap = {
  all: ALL_ENTRIES,
  today: ALL_ENTRIES, // @TODO
  site: ENTRY_LIST_OF_SITE,
};

export default class EntryList extends Component {
  render() {
    const { type, offset, limit } = this.props;
    const query = queryMap[isNaN(parseInt(type)) ? type : 'site'];
    const variables = isNaN(parseInt(type)) ? { offset, limit } : { siteId: type, offset, limit };

    return (
      <Query query={query} variables={variables}>
        {({ data, loading }) => {
          if (loading) return <p>loading</p>;
          const { count, rows } = data.allEntries || data.entryListOfSite || { count: 0, rows: [] };
          return (
            <div
              style={{
                maxWidth: "654px",
                margin: '0 auto',
              }}
            >
              <List itemLayout="vertical" size="large">
                {rows.map(r => (
                  <EntryListItem key={r.id} {...r} />
                ))}
              </List>
            </div>
          );
        }}
      </Query>
    );
  }
}
