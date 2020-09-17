#  PTT-web-frontend

配合 [openopentw/PTT-web-backend](https://github.com/openopentw/PTT-web-backend) 的 API 的前端，使用 React 實作。

支援 PTT 的功能有：登入/登出、抓我的最愛、抓看板文章列表、抓文章內文、推文、發文。

## DEMO

DEMO 網址：https://140.112.31.150/

另外因為個人興趣，這個網頁也支援 Kobo Libra H2O 的上下翻頁鍵，實際使用的影片：https://youtu.be/JfPoFylbTmY

**警告：**

使用這個網頁登入 PTT 之後，會從 server 端登入 PTT，所以帳號密碼必須傳送到 server 端。

不過本人保證 server 端不會記錄使用者的密碼。其實我偷用密碼的話算是犯罪，可以被告的。

或者你也可以自己 clone 來用，就不用怕被別人記錄密碼了。

## 使用

下載：[release](https://github.com/openopentw/PTT-web-frontend/releases)

把 [openopentw/PTT-web-backend/main.py#L19](https://github.com/openopentw/PTT-web-backend/blob/master/main.py#L19) 的 main.py 的 static_folder 指向 build 資料夾即可。

## 自己編譯

```shell
npm install
npm run build
```
