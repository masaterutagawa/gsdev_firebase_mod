//###############################################
// FirebaseのConfig及び初期化
//###############################################

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
    // 🔽 追加 / `9.2.0`の部分を↑のFirestoreから貼り付けたコードのバージョンに合わせる
    import { getFirestore, collection, addDoc, serverTimestamp, getDoc,getDocs,doc,query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";


    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "",
        authDomain: "fir-mod-4c51e.firebaseapp.com",
        projectId: "fir-mod-4c51e",
        storageBucket: "fir-mod-4c51e.appspot.com",
        messagingSenderId: "416914583463",
        appId: "1:416914583463:web:8e5bb249fd39bf5878d082"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);


    //日時をいい感じの形式にする関数
    function convertTimestampToDatetime(timestamp) {
      const _d = timestamp ? new Date(timestamp * 1000) : new Date();
      const Y = _d.getFullYear();
      const m = (_d.getMonth() + 1).toString().padStart(2, '0');
      const d = _d.getDate().toString().padStart(2, '0');
      const H = _d.getHours().toString().padStart(2, '0');
      const i = _d.getMinutes().toString().padStart(2, '0');
      const s = _d.getSeconds().toString().padStart(2, '0');
      return `${Y}/${m}/${d} ${H}:${i}:${s}`;
    }

    //Login画面へリダイレクトする関数
    function _redirect() {
      location.href = "index.html";
    }

    // 現在ログインしているユーザーを取得する
    const auth = getAuth();

    //###############################################
    //Loginしていれば処理します
    //###############################################
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        //ユーザー情報取得できます
        if (user !== null) {
          user.providerData.forEach((profile) => {
            // console.log("Email: " + profile.email+uid);
            // console.log("Photo URL: " + profile.photoURL);
          });
        }

        // 投稿ボタンをクリック
        $('#stickyNoteAdd').on('click', function (e) {
          e.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
          const postData = {
            title: $('#stickyNote__Title').val(),
            time: serverTimestamp(),
          };
          // コレクションpostにデータを追加
          addDoc(collection(db, 'post'), postData);
          $("#stickyNote__Title").val(" ");

           // バカチンガーの問いかけを取得
          getDocs(questionRef).then((querySnapshot) => {
            // ドキュメントのデータを取得して配列に保存
            const questionDataArray = [];
            querySnapshot.forEach((doc) => {
              const questionData = doc.data().question01;
              questionDataArray.push(questionData);
            });
            // ランダムなインデックスを生成
            const randomIndex = Math.floor(Math.random() * questionDataArray.length);
            // ランダムなインデックスのデータを取得してHTMLに表示
            const randomQuestionData = questionDataArray[randomIndex];
            $('#bakachiVoice').html(randomQuestionData);
          }).catch((error) => {
            console.error('データの取得エラー:', error);
          });
        });


        // データ取得条件の指定（今回は時間の新しい順に並び替えて取得）
        const post = query(collection(db, 'post'), orderBy('time', 'asc'));
        const users = query(collection(db, 'users'));
        // const question = query(collection(db, 'question'));
        const questionRef = collection(db, 'question');



        // ユーザーデータを取得
        onSnapshot(users, (querySnapshot) => {
          // データ取り出し
          querySnapshot.docs.forEach(function (doc) {
            const userInfo = {
              id: doc.id,
              data: doc.data(),
            };
            $('#nickname').html(userInfo.data.nickname);
            $('#fullname').html(`${userInfo.data.name01}${userInfo.data.name02}`);
          });
        });


        // データ取得
        onSnapshot(post, (querySnapshot) => {
          // データ取り出し
          const documents = [];
          querySnapshot.docs.forEach(function (doc) {
            const document = {
              id: doc.id,
              data: doc.data(),
            };
            documents.push(document);
          });

          // データを画面に表示
          const htmlElements = [];
          documents.forEach(function (document) {
            htmlElements.push(`<div class="stickyNoteYou"><p>${document.data.title}</p></div>`);
          });
          $('#stickyNote__container').html(htmlElements);
        });
      } else {
        _redirect();  // User is signed out
      }
    });

    //###############################################
    //Logout処理
    //###############################################
    $("#out").on("click", function (e) {
      e.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
      // signInWithRedirect(auth, provider);
      signOut(auth).then(() => {
        // Sign-out successful.
        $('#bakachiVoice').html('そろそろしめっせー');
        _redirect();
      }).catch((error) => {
        // An error happened.
        console.error(error);
      });
    });



