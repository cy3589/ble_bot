# BLE_BOT

## With Telegram BOT

> - Node.js 의 Bluetooth 제어 Library인 noble과 node상위버전에서 동작하게 패치된 bluetooth-hci-socket 라이브러리 사용
> - scan을 시작하고 MAC Adress와 advertisement.localName 이 미리 설정한 값과 일치하면 connect를 시도
> - connect 이벤트에 이벤트리스너를 등록하고 이벤트가 발생하면 Telegram Bot에 메세지를 전송하는 통신 함수를 호출
> - disconnect도 위와 마찬가지로 동작하며, 재연결 시 동작의 보장을 위해 기존의 이벤트 리스너를 모두 삭제하고 scan을 재시작 하는 코드를 포함한다.
> - ~~리스너가 계속 늘어나는 현상을 방지하기 위해 해당 블루투스 모듈의 이벤트리스너 갯수가 0이 아니라면 등록을 스킵하는 로직이 포함되어 있다.~~
> - 라즈베리 파이의 OS 설치 디스크인 SD카드 내에 부팅 시 자동실행 스크립트를 포함시켜 시작할 수 있으며 이 경우를 고려하여, 인터넷 연결이 고르지 못해 telegram 메세지 전송이 실패할 수 있으므로 통신 구문은 try-catch로 감싸 종료되지 않게 처리하였다.

> ### 텔레그램 봇의 생성과 적용 순서
>
> - 텔레그램 내 대화상태 찾기에서 BotFather를 검색
> - Start 버튼을 눌러 대화를 시작
> - /newbot을 입력하거나 클릭
> - 봇의 이름을 입력하여 봇 토큰을 생성
> - 아무 대화나 시도하고 기록을 만든다
> - index.js 파일 내 최상단에 위치한 주석에 따라 직접 봇 토큰을 수정하고 채팅방 ID를 확인하여 값을 교체하고 저장한다. (마우스와 키보드로 직접 교체하거나 SSH로 접속하여 교체 후 sudo node index.js 와 같이 node로 index.js파일을 실행하거나, 자동실행 스크립트가 셋팅되어 있다면 재부팅(하드웨어를 다루므로 sudo가 필요))

> ### 사용한 하드웨어
>
> - 메인 기기
>   - `기기` : Raspberry Pi 3B+
>   - `전원` : 5V 3A 라즈베리파이3 KC인증 Micro-USB 5P 아답터 [WT-5V3A-5P]
>   - `방열 케이스` : 라즈베리파이3B+ 알루미늄 방열 케이스
> - 블루투스
>   - `배터리`: 120mAh KC인증 리튬폴리머 배터리 [TW501030]
>   - `블루투스 모듈`: CC2541 블루투스 4.0 BLE 모듈 (DIP) [SZH-BTBA-002]
>   - `배터리 충전 모듈`: TP4056 리튬배터리 충전모듈 3.7V 1A 1S (USB-C Type) [SZH-LIP001]

> ### 사용한 소프트웨어
>
> - OS: LINUX(Raspberry Pi OS 32bit)
> - Bluetooth 제어
>   - 실행기: Node.js
>   - 라이브러리
>     - "axios": "^0.27.2"
>     - "@abandonware/noble": "^1.9.2-15"  

> ### 동작 (라즈베리파이 내에 작성되어있는 index.js가 정상적으로 실행되었다고 가정)
>
> - 서버가 실행되면 탐색을 시작  
> - 블루투스 모듈이 탐지되면 아래 로직을 실행  
>   - connect 이벤트에 connectCallback 이벤트 리스너를 등록  
>   - disconnect 이벤트에 disconnectCallback 이벤트 리스너를 등록  
>   - connect를 시도  
>   - scanning을 stop  
> - callbacks
>   - connectCallback
>     - 텔레그램 메세지를 전송  
>   - disconnectCallback
>       - 텔레그램 메세지를 전송  
>       - scanning을 start
> 
> 블루투스 모듈의 복잡한 기능이나 state핀 등의 기능은 이용하지 않으며 전원만을 공급하여 광고모드(advertise)로만 이용하였다.

## Raspberry Pi Setting Guid

> ### OS설치
>
> - Raspberry Pi Imager 실행
> - 운영체제 -> 삭제 -> 저장소 선택-> SD카드 선택 -> 쓰기 -> OK
> - 운영체제 -> RASPBERRY PI OS(32-BIT) 선택 -> SD카드 선택
> - 우측 하단의 설정(톱니) 클릭 -> SSH 사용
> - 사용자 이름 및 비밀번호 설정 -> 사용할 이름과 비밀번호 입력
> - wifi설정(optional) -> SSID, 비밀번호 입력
> - 나머지 Default 그대로 사용
> - 저장
> - 쓰기
>
> ### SSH 접속 세팅(VSCODE)
>
> - 공유기 페이지 접속 -> 라즈베리파이에 할당된 내부 IP 확인
> - F1 -> Remote입력 -> Remote-SSH: Open SSH Configuration file 클릭
>
> ```
> Host 호스트이름(임의로 지정)
> HostName 위에서 확인한 내부 IP
> User 위의 OS설치 에서 설정한 이름
> ```
>
> -F1 -> Remote-SSH: Connect to Host -> 호스트이름 클릭 -> 비밀번호 입력
>
> > ```
> > @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
> > @    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
> > @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
> > ```
> >
> > 다음과 같은 에러메세지가 뜬다면 cmd와 같은 콘솔을 열어  
> > ssh-keygen -R HostName을 입력하여 ssh 키를 재생성 한다.  
> > Ex) ssh-keygen -R 192.168.0.7

> ## 초기 세팅
>
> - ssh로 라즈베리파이에 접속되었다면 터미널에서  
>   `sudo apt-get update`  
>   `sudo apt-get upgrade`  
>   `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`  
>   `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`  
>   `sudo apt update`  
>   `sudo apt install yarn`  
>   `curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh`  
>   `sudo bash nodesource_setup.sh`  
>   `sudo apt-get install -y nodejs`  
>   `rm nodesource_setup.sh`
>   `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`  

> ## Setup
>
> `git clone https://github.com/cy3589/ble_bot.git NODE_BLE`  
> `cd NODE_BLE`  
> `yarn`
>
> ## Start
>
> `sudo node index.js`

> ## BlueTooth 모듈 세팅
>
> - 위 과정의 Setup 까지 완료되었다면 (Start를 했다면 Ctrl+C 또는 Ctrl+Z를 입력하여 종료)
> - 블루투스 모듈에 전원을 넣고 콘솔에서
>
> ```
> bluetoothctl 을 입력 -> scan on 을 입력 -> MLT-05가 포함된 라인을 찾는다(상술한 블루투스 모듈 사용 기준)
> 맨 앞 MAC ADDRESS를 index.js 파일 내 MAC_ADDRESS를 교체(필요에 따라 LOCAL_NAME도 교체하여 사용 가능)
> 저장하고 다시 sudo node index.js를 입력하여 실행
> ```
