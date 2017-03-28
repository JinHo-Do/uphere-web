import React from 'react';
import s from './ChatList.css';

class ChatList extends React.Component {
  constructor(props) {
    super(props);
  }

  clickHandler(chat) {
    this.props.showChat(chat);
  }

  _getFriend(chat) {
    const friend = chat.participants.filter((user) => {
      return user.uphere_id !== this.props.user.uphereID;
    })[0];

    return friend;
  }

  _isYourMessage(message) {
    return message.sender_id === this.props.user.uphereID;
  }

  render() {
    return (
      <div>
        {this.props.chats.length > 0 && this.props.chats.map((chat, i) => {
          return (
            <div ref="chatroom" className={`${s.chatroom_container}`} key={i} onClick={(e) => {
              e.preventDefault();
              this.clickHandler(chat);
            }} >
              <div className={`${s.img_divide}`} >
                { <img src={this._getFriend(chat).profile_image_url} /> }
              </div>
              <div className={`${s.usernames}`}>
                <h4>
                  { this._getFriend(chat).name }
                </h4>
                <p>
                  {
                    chat.messages.length <= 0 ? null :
                      <span className={`${s.latest_text}`}>
                        {
                          this._isYourMessage(chat.messages[chat.messages.length - 1]) ?
                            'You: ' : null
                        }
                        { chat.messages[chat.messages.length - 1].text }
                      </span>
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ChatList;
