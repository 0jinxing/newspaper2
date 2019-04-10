import { Component } from 'react';
import { List, Icon } from 'antd';

const { Item: ListItem } = List;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export default class EntryListItem extends Component {
  render() {
    const { title, link, snippet } = this.props;
    return (
      <ListItem
        key={link}
        actions={[
          <IconText type="star-o" text="156" />,
          <IconText type="like-o" text="156" />,
          <IconText type="message" text="2" />,
        ]}
      >
        <ListItem.Meta title={title} description={<a href={link}>{link}</a>} />
        <div dangerouslySetInnerHTML={{ __html: snippet }} />
      </ListItem>
    );
  }
}
