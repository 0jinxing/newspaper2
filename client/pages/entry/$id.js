import React from 'react';
import gql from 'graphql-tag';
import { Card } from '@blueprintjs/core';
import IndexLayout from '@/layouts/IndexLayout';

const SIDE_DATA = gql`
  query SideData {
    profile {
      username
      avatar
    }
    ownSubscriptionList {
      rows {
        title
        id
      }
    }
  }
`;

const ENTRY_DETAIL = gql`
  query EntryDetail($id: ID!) {
    entryDetail(id: $id) {
      id
      link
      title
      date
      description
    }
  }
`;

export default class Post extends React.Component {
  static async getInitialProps({ query, apolloClient }) {
    let props = { data: {}, loading: false, error: null };
    try {
      const entryDetail = await apolloClient.query({
        query: ENTRY_DETAIL,
        variables: query,
      });
      props = entryDetail;
    } catch {}

    try {
      const sideData = await apolloClient.query({
        query: SIDE_DATA,
      });
      props = {
        data: { ...props.data, ...sideData.data },
        loading: props.loading || sideData.loading,
        error: props.error || sideData.error,
      };
    } catch {}
    return props;
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const entryDetail = this.props.data.entryDetail;
    let contentEl = null;
    if (!entryDetail) {
      contentEl = <Card>内容已经删除</Card>;
    } else {
      contentEl = (
        <Card>
          <h1>{entryDetail.title}</h1>
          <section
            className={'newspaper2-rss-content'}
            dangerouslySetInnerHTML={{ __html: entryDetail.description }}
          />
        </Card>
      );
    }
    return <IndexLayout {...this.props}>{contentEl}</IndexLayout>;
  }
}
