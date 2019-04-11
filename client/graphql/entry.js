import gql from 'graphql-tag';

export const ALL_ENTRIES = gql`
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

export const ENTRY_LIST_OF_SITE = gql`
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

export const TODAY_ENTRY_LIST = gql`
  query TodayEntryList($offset: Int, $limit: Int) {
    todayEntryList(offset: $offset, limit: $limit) {
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
