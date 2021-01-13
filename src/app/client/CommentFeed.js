import React from 'react'
import { Button, Comment, Icon } from 'semantic-ui-react'

// remove the css in favor of static in html.js

class CommentFeed extends React.Component {

  constructor(props) {
    super(props)
  }

  renderActions(){
    return (<Comment.Actions>
      <Comment.Action>Reply</Comment.Action>              
    </Comment.Actions>);
  }

  render() {
    return (
      <Comment.Group>
        <Comment>
          <Comment.Avatar as='a' src='https://en.gravatar.com/userimage/33106772/f47cb58e49c713d06c9e05f67fb2bf65.png' />
          <Comment.Content>
            <Comment.Author>Dennis</Comment.Author>
            <Comment.Text>
              Isn't she cute?
        </Comment.Text>            
          </Comment.Content>
        </Comment>
      </Comment.Group>
    )
  }
}

  // export default () => (<div>{style}<Comments/></div>)
export default CommentFeed;