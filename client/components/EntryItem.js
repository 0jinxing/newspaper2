import React from 'react';
import Link from 'next/link';
import { Card } from '@blueprintjs/core';
import styles from './EntryItem.css';

class EntryItem extends React.Component {
  render() {
    const { title, summary, id } = this.props;
    return (
      <Card className={styles.cardWrap}>
        <h1 className={styles.entryTitle}>
          <Link href={`/entry/$id?id=${id}`} as={`/entry/${id}`}>
            <a> {title}</a>
          </Link>{' '}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: summary }} />
      </Card>
    );
  }
}

export default EntryItem;
