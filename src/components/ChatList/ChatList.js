import React from 'react';
import s from './ChatList.css';
import { IMG_SERVER } from '../../config.js';

class ChatList extends React.Component {
  constructor(props) {
    super(props);

    const defaultCurrentChatIndex = this.props.chats.map(chat => chat.uphere_id).indexOf(this.props.currentChatID);

    this.state = {
      currentChatIndex: defaultCurrentChatIndex < 0 ? 0 : defaultCurrentChatIndex,
      showModal: false,
      showDeleteCog: false,
      showDeleteChatModal: false,
      currentChatId: 0
    };
  }

  componentDidMount() {
    document.onclick = (e) => {
      if (e.target !== this.outermodal &&
        e.target !== this.innermodal &&
        e.target !== this.configBtn &&
        this.outermodal.className !== `${s.hide_outer_modal}`) {
        this.setState((prevState) => {
          return {
            showModal: !prevState.showModal
          };
        });
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const defaultCurrentChatIndex = nextProps.chats.map(chat => chat.uphere_id).indexOf(nextProps.currentChatID);
    const newCurrentChatIndex = defaultCurrentChatIndex < 0 ? 0 : defaultCurrentChatIndex;

    this.setState({
      currentChatIndex: newCurrentChatIndex
    });
  }

  clickHandler(chat) {
    this.props.showChat(chat);
  }

  _getFriend(chat) {
    const friend = chat.participants.filter((user) => {
      return user.uphere_id !== this.props.user.uphere_id;
    })[0];

    return friend;
  }

  _isYourMessage(message) {
    return message.sender_id === this.props.user.uphere_id;
  }

  _msgTime(created_at) {
    let date = new Date(Date.parse(created_at));
    let date_day = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date_day[date.getDay()]}요일`;
  }

  render() {
    const logoutModal = (
      <div ref={(ref) => { this.outermodal = ref; }} className={this.state.showModal ? `${s.not_hide_outer_modal}` : `${s.hide_outer_modal}`}>
        <div ref={(ref) => { this.innermodal = ref; }} className={`${s.show_logout_inner_modal}`}>
          <span onClick={(e) => {
            e.preventDefault();
            this.setState((prevState, prevProps) => {
              return {
                showModal: !prevState.showModal
              };
            });
          }} className={`${s.logout}`} />
          <span className={`${s.logoutMsg}`} >
            <i className="fa fa-sign-out" aria-hidden="true"/> Logout
          </span>
        </div>
      </div>
    );

    const chatDeleteModal = (
      <div ref={(ref) => { this.deleteModal = ref; }} className={this.state.showDeleteChatModal ? `${s.not_hide_outer_delete_modal}` : `${s.hide_outer_modal}`}>
        <div className={`${s.show_inner_modal}`}>
          <li className={`${s.on_delete}`} onClick={(e) => {
            e.preventDefault();
            this.props.deleteChat(this.state.currentChatId);
            this.setState((prevState) => {
              return {
                showDeleteChatModal: !prevState.showDeleteChatModal,
                showDeleteCog: !prevState.showDeleteCog
              };
            });
          }}>
            <span className={`${s.logoutMsg}`} >
              <i className="fa fa-trash" aria-hidden="true"/> Delete
            </span>
          </li>
        </div>
      </div>
    );

    return (
      <div>
        <div className={`${s.chatlist_header}`}>
          <div>
            <i ref={(ref) => { this.configBtn = ref; }} className="fa fa-cog fa-lg" aria-hidden="true" onClick={(e) => {
              e.preventDefault();
              this.setState((prevState) => {
                return {
                  showModal: !prevState.showModal
                };
              });
            }} >
            </i>
          </div>
          <div>
            <h4>Messenger</h4>
          </div>
          <div>
            <i className="fa fa-commenting-o fa-lg" aria-hidden="true"></i>
          </div>
        </div>
        <ul className={s.chatlist_container}>
          {logoutModal}
          {chatDeleteModal}
          {this.props.chats.length > 0 && this.props.chats.map((chat, i) => {
          return (
            <li ref="chatroom" key={i}
              className={`${s.chatroom_container} ${this.state.currentChatIndex === i ? s.chatroom_click : ''}`}
              onMouseEnter={(e) => {
                e.preventDefault();
                if (!this.state.showDeleteChatModal) {
                  this.setState((prevState) => {
                    return {
                      showDeleteCog: !prevState.showDeleteCog,
                      currentChatId: this.props.chats[i].uphere_id,
                      currentChatIndex: i
                    };
                  });
                }
              }}
              onMouseLeave={(e) => {
                e.preventDefault();
                if (!this.state.showDeleteChatModal) {
                  this.setState((prevState) => {
                    return {
                      showDeleteCog: !prevState.showDeleteCog
                    };
                  });
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                this.setState({
                  currentChatIndex: i
                });
                this.clickHandler(chat);
            }}>
              <img src={this._getFriend(chat).profile_image_url} />
              <span className={`${s.chatroom_username}`}>
                { this._getFriend(chat).name }
              </span>
              <div className={`${s.chatroom_time}`}>
                <span className={`${s.chatroom_check}`}>{chat.messages.length > 0 ? this._msgTime(chat.messages[chat.messages.length - 1].created_at) : null}</span>
                <div className={`${this.state.showDeleteCog && this.state.currentChatIndex === i ? s.chat_cog : s.hide_chat_cog}`}>
                  <i id="deleteCog" ref={(ref) => { this.deleteCog = ref; }} className={`fa fa-cog fa-lg ${s.deleteCog}`} aria-hidden="true" onClick={(e) => {
                    e.preventDefault();
                    this.deleteModal.style.top = `${e.pageY + 20}px`;
                    this.deleteModal.style.left = `${e.pageX - 15}px`;
                    if (this.state.currentChatIndex === i) {
                      this.setState((prevState) => {
                        return {
                          showDeleteChatModal: !prevState.showDeleteChatModal
                        };
                      });
                    }
                  }} >
                  </i>
                </div>
              </div>
              <div className={`${s.chatroom_preview}`}>
                {
                  chat.messages.length <= 0 ? null :
                    <span>
                      {
                        this._isYourMessage(chat.messages[chat.messages.length - 1]) ?
                          'You: ' : null
                      }
                      <span>{ chat.messages[chat.messages.length - 1].text.indexOf(IMG_SERVER) > -1 ?
                        '이미지 파일' : chat.messages[chat.messages.length - 1].text
                      }</span>
                    </span>
                }
              </div>
            </li>
          );
        })}
        {!this.props.chats.length && <div className={`${s.default}`}>
          <p className={`${s.default_text}`}>
            Choose friend to create a chat room!
          </p>
          <p className={`${s.default_text_KR}`}>
            <b>친구를 선택하면 새로운 채팅방이 만들어져요.</b>
          </p>
          </div>}
        </ul>
      </div>
    );
  }
}

export default ChatList;
