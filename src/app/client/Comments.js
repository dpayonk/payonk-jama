import React from 'react'
import Comment from '@bit/semantic-org.semantic-ui-react.comment'
import Icon from '@bit/semantic-org.semantic-ui-react.icon'

const style = <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css'/>

const Comments = () => (
  <Comment.Group>
    <Comment>
      <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
      <Comment.Content>
        <Comment.Author>Tom Lukic</Comment.Author>
        <Comment.Text>
          This will be great for business reports. I will definitely download this.
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>Reply</Comment.Action>
          <Comment.Action>Save</Comment.Action>
          <Comment.Action>Hide</Comment.Action>
          <Comment.Action>
            <Icon name='expand' />
            Full-screen
          </Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  </Comment.Group>
)

export default () => (<div>{style}<Comments/></div>)