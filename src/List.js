import React from 'react';
import {ReactComponent as Check} from './check.svg';

const List = ({ list, onRemoveItem }) =>
  (<div>
  <div style={{display: 'flex',textDecoration: 'underline'}}>
    <span style={{width: '40%'}}>Title</span>
    <span style={{width: '30%'}}>Author</span>
    <span style={{width: '10%'}}>Comments</span>
    <span style={{width: '10%'}}>Points</span>
    </div>
    {list.map(item => (
  <Item
    key={item.objectID}
    item={item}
    onRemoveItem={onRemoveItem}
  />
))}
  </div>)


const Item = ({ item, onRemoveItem }) => (
<div className="item">
  
  <span style={{ width: '40%' }}>
    <a href={item.url}>{item.title}</a>
  </span>
  <span style={{ width: '30%' }}>{item.author}</span>
  <span style={{ width: '10%' }}>{item.num_comments}</span>
  <span style={{ width: '10%' }}>{item.points}</span>
  <span style={{ width: '10%' }}>
    <button
      type="button"
      onClick={() => onRemoveItem(item)}
      className="button button_small"
    >
      <Check height="18px" width="18px" />
    </button>
  </span>
</div>
);

export default List;