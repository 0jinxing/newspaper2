import { Component } from 'react';
import { List, Icon } from 'antd';
import "./EntryListItem.less";

const { Item: ListItem } = List;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export default class EntryListItem extends Component {
  render() {
    const { title, link, summary } = this.props;
    return (
      <ListItem
        className="entry-list-item"
        key={link}
        actions={[
          <IconText type="star-o" text="156" />,
          <IconText type="like-o" text="156" />,
          <IconText type="message" text="2" />,
        ]}
      >
        <ListItem.Meta title={title} description={<a href={link}>{link}</a>} />
        <div className="rss-description-wrap" dangerouslySetInnerHTML={{ __html: summary }} />
      </ListItem>
    );
  }
}
