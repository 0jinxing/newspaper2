import { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { List } from 'antd';
import { connect } from 'react-redux';
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
  query EntryListOfSite($siteId: ID!, $offset: Int, $limit: Int) {
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
  ALL: ALL_ENTRIES,
  TODAY: ALL_ENTRIES, // @TODO
  SITE: ENTRY_LIST_OF_SITE,
};

class EntryList extends Component {
  render() {
    const { filter, offset, limit } = this.props;
    const query = queryMap[isNaN(parseInt(filter)) ? filter : 'SITE'];
    const variables = isNaN(parseInt(filter))
      ? { offset, limit }
      : { siteId: parseInt(filter), offset, limit };

    return (
      <Query query={query} variables={variables}>
        {({ data, loading }) => {
          if (loading) return <p>loading</p>;
          const { count, rows } = data.allEntries || data.entryListOfSite || { count: 0, rows: [] };
          return (
            <div
              style={{
                maxWidth: '654px',
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

const mapStateToProps = state => {
  return {
    filter: state.entryFilter.filter,
  };
};

export default connect(mapStateToProps)(EntryList);
