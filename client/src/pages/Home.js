import React, { Component } from 'react'
import Navigation from '../components/Navigation';
import Axios from 'axios';
import $ from 'jquery';

const dev = false
const localHost = dev ? 'http://localhost:3001/' : '/'


class Home extends Component {

  //______________________________Constructor__________________________________

  constructor(props) {
    super(props);

    this.state = {
      globalPerso: 0,
      globals: [],
      topFlappyRecords: [],
      topSnakeRecords: [],
      flappyRecords: [],
      snakeRecords: [],
      showMe: true,
      username: localStorage.getItem("username"),
      userid: localStorage.getItem("userid"),
      flappy1: "",
      flappy2: "",
      flappy3: "",
      flappy4: "",
      flappy5: "",
      snake1: "",
      snake2: "",
      snake3: "",
      snake4: "",
      snake5: "",
      whack1: "",
      whack2: "",
      whack3: "",
      whack4: "",
      whack5: "",
      brick1: "",
      brick2: "",
      brick3: "",
      brick4: "",
      brick5: ""
    }
  }

  async componentDidMount() {

    //______________________________GET TOPS__________________________________

    const getFlappyTop =
      await Axios.post(`${localHost}apiroutes/topGameRecords`, {
        game_id: 1 //flappy game_id
      })
    //get user's top
    const top1Flappy = getFlappyTop.data[0] ? getFlappyTop.data[0] : 0
    const flappy1 = top1Flappy.user_name === this.state.username ? 15 : 0
    this.setState({ flappy1: flappy1 })
    const top2Flappy = getFlappyTop.data[1] ? getFlappyTop.data[1] : 0
    const flappy2 = top2Flappy.user_name === this.state.username ? 10 : 0
    this.setState({ flappy2: flappy2 })
    const top3Flappy = getFlappyTop.data[2] ? getFlappyTop.data[2] : 0
    const flappy3 = top3Flappy.user_name === this.state.username ? 7 : 0
    this.setState({ flappy3: flappy3 })
    const top4Flappy = getFlappyTop.data[3] ? getFlappyTop.data[3] : 0
    const flappy4 = top4Flappy.user_name === this.state.username ? 5 : 0
    this.setState({ flappy4: flappy4 })
    const top5Flappy = getFlappyTop.data[4] ? getFlappyTop.data[4] : 0
    const flappy5 = top5Flappy.user_name === this.state.username ? 3 : 0
    this.setState({ flappy5: flappy5 })

    const getSnakeTop =
      await Axios.post(`${localHost}apiroutes/topGameRecords`, {
        game_id: 2 //snake game_id
      })
    //get user's top
    const top1Snake = getSnakeTop.data[0] ? getSnakeTop.data[0] : 0
    const snake1 = top1Snake.user_name === this.state.username ? 15 : 0
    this.setState({ snake1: snake1 })
    const top2Snake = getSnakeTop.data[1] ? getSnakeTop.data[1] : 0
    const snake2 = top2Snake.user_name === this.state.username ? 10 : 0
    this.setState({ snake2: snake2 })
    const top3Snake = getSnakeTop.data[2] ? getSnakeTop.data[2] : 0
    const snake3 = top3Snake.user_name === this.state.username ? 7 : 0
    this.setState({ snake3: snake3 })
    const top4Snake = getSnakeTop.data[3] ? getSnakeTop.data[3] : 0
    const snake4 = top4Snake.user_name === this.state.username ? 5 : 0
    this.setState({ snake4: snake4 })
    const top5Snake = getSnakeTop.data[4] ? getSnakeTop.data[4] : 0
    const snake5 = top5Snake.user_name === this.state.username ? 3 : 0
    this.setState({ snake5: snake5 })

    const getWhackTop =
      await Axios.post(`${localHost}apiroutes/topGameRecords`, {
        game_id: 3 //whackamalou game_id
      })
    //get user's top
    const top1Whack = getWhackTop.data[0] ? getWhackTop.data[0] : 0
    const whack1 = top1Whack.user_name === this.state.username ? 15 : 0
    this.setState({ whack1: whack1 })
    const top2Whack = getWhackTop.data[1] ? getWhackTop.data[1] : 0
    const whack2 = top2Whack.user_name === this.state.username ? 10 : 0
    this.setState({ whack2: whack2 })
    const top3Whack = getWhackTop.data[2] ? getWhackTop.data[2] : 0
    const whack3 = top3Whack.user_name === this.state.username ? 7 : 0
    this.setState({ whack3: whack3 })
    const top4Whack = getWhackTop.data[3] ? getWhackTop.data[3] : 0
    const whack4 = top4Whack.user_name === this.state.username ? 5 : 0
    this.setState({ whack4: whack4 })
    const top5Whack = getWhackTop.data[4] ? getWhackTop.data[4] : 0
    const whack5 = top5Whack.user_name === this.state.username ? 3 : 0
    this.setState({ whack5: whack5 })

    const getBrickTop =
      await Axios.post(`${localHost}apiroutes/topGameRecords`, {
        game_id: 4 //Brick game_id
      })
    //get user's top
    const top1Brick = getBrickTop.data[0] ? getBrickTop.data[0] : 0
    const brick1 = top1Brick.user_name === this.state.username ? 15 : 0
    this.setState({ brick1: brick1 })
    const top2Brick = getBrickTop.data[1] ? getBrickTop.data[1] : 0
    const brick2 = top2Brick.user_name === this.state.username ? 10 : 0
    this.setState({ brick2: brick2 })
    const top3Brick = getBrickTop.data[2] ? getBrickTop.data[2] : 0
    const brick3 = top3Brick.user_name === this.state.username ? 7 : 0
    this.setState({ brick3: brick3 })
    const top4Brick = getBrickTop.data[3] ? getBrickTop.data[3] : 0
    const brick4 = top4Brick.user_name === this.state.username ? 5 : 0
    this.setState({ brick4: brick4 })
    const top5Brick = getBrickTop.data[4] ? getBrickTop.data[4] : 0
    const brick5 = top5Brick.user_name === this.state.username ? 3 : 0
    this.setState({ brick5: brick5 })

    //Sum up global score
    const s = this.state
    const globalPerso =
      s.flappy1 + s.flappy2 + s.flappy3 + s.flappy4 + s.flappy5
      + s.snake1 + s.snake2 + s.snake3 + s.snake4 + s.snake5
      + s.whack1 + s.whack2 + s.whack3 + s.whack4 + s.whack5
      + s.brick1 + s.brick2 + s.brick3 + s.brick4 + s.brick5

    this.setState({ globalPerso: globalPerso })
    //______________________________PUT/GET GLOBAL__________________________________
    Axios.put(`${localHost}apiroutes/putGlobal`, {
      global: this.state.globalPerso,
      user_id: this.state.userid,
      user_name: this.state.username
    })

    const getGlobals =
      await Axios.get(`${localHost}apiroutes/globals`)
    this.setState({ globals: getGlobals.data })

  }

  //_______________________________Render___________________________________

  render() {

    //replace a letter ("i" by "!") to change its color
    $(document).ready(function () {
      const text = $("#phrase").html().replace(/i/, " <h1 class='letter'> !</h1>");
      $("#phrase").html(text)
    });

    const globals = this.state.globals.map((global) => {
      if (global.user_name === this.state.username) {
        return <div key={global.id} className="myglobalrow">{this.state.globalPerso}</div>
      } else {
        return <div key={global.id} className="globalrow">{global.global}</div>
      }
    })
    const usersGlobals = this.state.globals.map((userGlobal) => {
      if (userGlobal.user_name === this.state.username) {
        return <div key={userGlobal.id} className="myglobalrow">{userGlobal.user_name}</div>
      } else {
        return <div key={userGlobal.id} className="globalrow">{userGlobal.user_name}</div>
      }
    })

    return (
      <>
        <Navigation />
        <div className="Home">
          <h1 id="phrase">RECORD  iT</h1>
          <div className="podium">
            <h1 className="bestplayer first">{this.state.globals[0] ? this.state.globals[0].user_name : ''}</h1>
            <div className="best23global">
              <h1 className="bestplayer second">{this.state.globals[1] ? this.state.globals[1].user_name : ''}</h1>
              <h1 className="bestplayer third">{this.state.globals[2] ? this.state.globals[2].user_name : ''}</h1>
            </div>
          </div>

          <div className="globalinfo">
            <p>Barème:</p>
            <p>Top1 = 15 pts</p>
            <p>Top2 = 10 pts</p>
            <p>Top3 = 7 pts</p>
            <p>Top4 = 5 pts</p>
            <p>Top5 = 3 pts</p>
          </div>

          <div className="global">

            <div className="myglobalscore">
              <header>
                <h2>{this.state.username}</h2>
              </header>
              <div className="myglobalscores">

                <div>
                  <h4>Flappy Holbie</h4>
                  <p>{0 + this.state.flappy1 + this.state.flappy2 + this.state.flappy3 + this.state.flappy4 + this.state.flappy5}</p>
                </div>
                <div>
                  <h4>Snake</h4>
                  <p>{0 + this.state.snake1 + this.state.snake2 + this.state.snake3 + this.state.snake4 + this.state.snake5}</p>
                </div>
                <div>
                  <h4>Whack A Malou</h4>
                  <p>{0 + this.state.whack1 + this.state.whack2 + this.state.whack3 + this.state.whack4 + this.state.whack5}</p>
                </div>
                <div>
                  <h4>Brick !t</h4>
                  <p>{0 + this.state.brick1 + this.state.brick2 + this.state.brick3 + this.state.brick4 + this.state.brick5}</p>
                </div>

              </div>
              <h1>{this.state.globalPerso ? this.state.globalPerso : 0}</h1>
            </div>

            <div className="globalscore">
              <header><h2>Joueurs</h2></header>
              <table>
                <tbody>
                  <tr>
                    <td>
                      {usersGlobals}
                    </td>
                    <td>
                      {globals}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Home;