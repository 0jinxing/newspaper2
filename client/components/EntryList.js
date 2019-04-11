import { Component } from 'react';
import { Query } from 'react-apollo';
import { List } from 'antd';
import { connect } from 'react-redux';
import EntryListItem from '../components/EntryListItem';
import { ALL_ENTRIES, TODAY_ENTRY_LIST, ENTRY_LIST_OF_SITE } from '../graphql/entry';

const queryMap = {
  ALL: ALL_ENTRIES,
  TODAY: TODAY_ENTRY_LIST,
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
          const { count, rows } = data.allEntries ||
            data.todayEntryList ||
            data.entryListOfSite || { count: 0, rows: [] };
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
