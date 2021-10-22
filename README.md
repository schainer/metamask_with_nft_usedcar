메타마스크 연동 NFT 중고차 거래 플렛폼
====

현 시스템에 메타마스크 적용 R&D 시연자료
<br/>

개발자: 김준하
<br/>

핵심요약
----
1. web3.js를 이용한 프론트엔드에서의 메타마스크 연동 및 작동원리
2. 메타마스크를 이용하여 ERC-721 NFT Standard를 기반으로 제작한 NFT의 거래
<br/>

시스템 요구사항
----
- solidity compiler(solc) `v0.6.2`
- node.js `v14.2.0`
- yarn `v1.22`
- truffle `v5.1.30`
- Ganache(GUI) v.2.4.0
- (optional) vscode를 text editor로 사용시 solidity 확장프로그램의 컴파일러 버전 확인
<br/>

시스템 구조
----
- /client: React 기반의 Frontend 웹 애플리케이션. 크롬브라우저에 메타마스크 확장 프로그램 사용 권장
- /contracts: 스마트 계약 폴더. UserCarToken.sol 이 NFT 메인 계약 파일.
- truffle-config.js 에서 3가지 확인사항
    + contracts_build_directory: "./client/src/contracts"
    + development: { ... port: 7545, ... }
    + compilers: { ... solc: { ... version: 0.6.2 ...} ... }
<br/>

![Alt text](/sample.png "실행화면 예시")

작동방법
----
1. 본 저장소를 로컬 영역에 git clone 하고 시스템 요구사항에 관한 모든 설치를 완료한다.
2. Ganache 를 Quick Start로 실행하고 메타마스크에 http://127.0.0.1:7545 네트워크를 등록한 후 계정 2개 이상의 private key를 계정 불러오기를 통해 등록한다.
3. clone 된 로컬 directory (이하 /usedcar 이라고 가정함)에서 truffle migrate (이전에 한번 실행한 적이 있을 시 --reset 플레그를 포함하여)실행한다.
```
usedcar$ truffle migrate
혹은
usedcar$ truffle migrate --reset
```
4. 2번 migration을 통해 배포된 계약의 주소(contract address)를 복사하여 메타마스크 각 계정의 토큰추가 > 사용자 정의토큰 > 토큰 컨트렉트 주소에 붙여넣고 UCAR 토큰이 등록되었음을 확인한다.

```
   Replacing 'UsedCarToken'
   ------------------------
   > transaction hash:    0x4c2561bd5b06b7cb7fd2e4fc870ad4d1a44e94dca295fd06136898712aa0d669
   > Blocks: 0            Seconds: 0
   > contract address:    0x91D44Cc714Be2a23EAEF5F7BD5827722429D90F8
   > block number:        23
   > block timestamp:     1592450793
   > account:             0xd669692f60351A993440AB0D7419E1A212524F86
   > balance:             99.88295702
   > gas used:            2511552 (0x2652c0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.05023104 ETH
```
5. ./client/src/res 안에 있는 used_car.json 파일을 열어서 10개의 사전등록되어있는 차량고유번호(vin)을 확인한다.
```
    ...
    {
        "vin": 26483, /*이 번호를 10개 확인한다.*/
        "price": "$10,600",
        "picture": "./res/usedcar_01.jpeg",
        "model": "Toyota Corolla",
        "year": 2017,
        "mile": 22734
    },
    ...
```
6. client 폴더로 이동하여 npm start를 실행하여 FrontEnd 웹 애플리케이션을 실행한다.
```
usedcar/client$ npm start
```
7. 중고차 매물등록의 차량고유번호 입력란에 5번에서 확인한 vin 번호 10개 중 1개를 입력하고 차량등록버튼을 누르고 메타마스크로 거래를 승인한다.
8. 차량이 화면상에 추가되고, 구매하기 버튼을 눌러보면 '본인 소유의 차량입니다' 라는 메세지가 뜨는 것을 확인한다. (차량이 추가되지 않을 시에는 메타마스크로 이동하여 허가되지 않은 계약이 큐에 있는지 확인한다.)
9. 메타마스크에 4번에서 추가한 UCAR 토큰의 개수가 1로 증가한 것을 확인한다.
10. 메타마스크에서 다른 계정으로 전환한 후 웹 애플리케이션 페이지를 새로고침하고, 우측 상단의 계정 주소가 정확한지 확인한다.
11. 아까 추가한 차량의 구매하기 버튼 클릭 > 메타마스크 승인절차 > 구매가 완료되었습니다 메세지까지 차례대로 확인한다.
12. 5번에서 json 파일의 차량번호를 자유롭게 입력하여 차량을 매물로 등록하고, 본인소유의 차량이 아닌 차량을 구매하는 경우, UCAR NFT 토큰의 개수의 증감을 메타마스크에서 확인할 수 있다.
