import React, { Component } from 'react';
import Web3 from 'web3';
import UsedCar from './contracts/UsedCarToken.json';
import data from './res/used_car.json';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    console.log("web3 may be attatched!")
    this.loadUsedCar()
  }

  //find the blockchain network which metamask window is looking for and make a connection with metamask
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  //find contract on the blockchain network with web3 connection
  async loadUsedCar() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(`account check? ${accounts}`)
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    //finding 
    const networkData = UsedCar.networks[networkId]
    if(networkData) {
      const abi = UsedCar.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      console.log(contract)
      this.initialLoad()
    } else {
      window.alert("smart contract is not deployed on this network.");
    }
  }

  initialLoad() {
    data.map((info) => {
      var vin = info.vin
      this.state.contract.methods.isExist(vin).call({from: this.state.account}).then((res) => {
        if(res) {
          this.setState({ onMarket: [...this.state.onMarket, info] })
        }
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      onMarket:[]
    }
  }

  //Blockchain function onclick action embedded
  mint = (vin) => {
    this.state.contract.methods.isExist(vin).call({from: this.state.account}).then((res) => {
      if(!res) {
        data.map((info) => {
          if(info.vin === vin) {
            this.state.contract.methods.mint(vin).send({from: this.state.account}).then(() => {
              this.setState({ onMarket: [...this.state.onMarket, info] })
              return;
            })
          }
        })
        return;
      } else {
        alert('등록된 차량이 있습니다.')
        return;
      }
    })
  }

  purchase = (vin) => {
    this.state.contract.methods.isOwnerOf(vin).call({from: this.state.account}).then((res) => {
      if(!res) {
        this.state.contract.methods.ownerOf(vin).call({from: this.state.account}).then((addr) => {
          console.log(`owner Address: ${addr}`)
          this.state.contract.methods.purchase(addr,this.state.account,vin).send({from: this.state.account}).then(() => {
            alert('구매가 완료되었습니다.')
          })
        })
      } else {
        alert('본인 소유의 차량입니다')
      }
    })
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div
            className="text-white navbar-brand col-sm-3 col-md-2 mr-0"
            rel="noopener noreferrer"
          >
            Used Car Market using ERC-721
          </div>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>중고차 매물등록</h1>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  var vin = parseInt(this.vin.value);
                  this.mint(vin)
                }}
              >
                <label>차량고유번호(VIN): </label>
                <input
                  type='text'
                  className='form-control mb-1' 
                  ref={(input) => {this.vin = input}}
                />
                <button className='btn btn-block btn-primary' type='submit'>차량등록</button>
              </form>
            </div>
          </div>
        </div>
        <hr/>
        {/* Flexbox Wrap */}
        <div className="d-flex flex-wrap py-2">
          {/* Data Rendering part */}
          {this.state.onMarket.map((info) => {
            var vin = info.vin
            return(
              <UsedCarDisplay info={info} action={() => this.purchase(vin)}/>
            )
          })}
        </div>

      </div>
    )
  }
}

class UsedCarDisplay extends Component {
  render() {
    return(
      <div className="card ml-3 mb-3" style={{width: '18rem'}}>
        <img className="card-img-top img-thumbnail" src={require(`${this.props.info.picture}`)} style={{width: '286px', height: '200px'}} alt='render'/>
        <div className="card-body">
          <h3 className="card-title">{this.props.info.price}</h3>  
          <p className="card-text">
            모델: {this.props.info.model} <br/>
            연도: {this.props.info.year}년<br/>
            마일수: {this.props.info.mile} mile<br/>
            차량고유번호: {this.props.info.vin} <br/>
          </p>
          <button className="btn btn-primary" onClick={this.props.action}>구매하기</button>
        </div>
      </div>
    );
  }
}
export default App;
