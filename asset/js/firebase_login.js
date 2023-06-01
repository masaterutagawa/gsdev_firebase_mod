// 必要なFirebaseライブラリを読み込み
        import { initializeApp }
            from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
        import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword }
            from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

        //FirebaseConfig [ KEYを取得して設定！！ ]
        const firebaseConfig = {
            apiKey: "",
            authDomain: "fir-mod-4c51e.firebaseapp.com",
            projectId: "fir-mod-4c51e",
            storageBucket: "fir-mod-4c51e.appspot.com",
            messagingSenderId: "416914583463",
            appId: "1:416914583463:web:8e5bb249fd39bf5878d082"
        };
        // Firebaseサービスの初期化
        const app = initializeApp(firebaseConfig);
        // Firebase 認証を初期化し、サービスを参照
        const auth = getAuth(app);

        // 新規登録ボタンをクリックしたときの処理
        $('#register').on('click', function (e) {
            e.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
            const email = $('#mailAddress').val();
            const password = $('#password').val();
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("登録に成功しました:", user.uid);
                    console.log("登録に成功しました:", userCredential.user.uid);
                })
                .catch((error) => {
                    console.log("登録エラー:", error.message);
                });
        });


        // ログインボタンをクリックしたときの処理
        $('#login').on('click', function (e) {
            e.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
            const email = $('#mailAddress').val();
            const password = $('#password').val();
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("ログインに成功しました:", user.uid);
                    location.href = "chatapp.html";
                })
                .catch((error) => {
                    console.log("ログインエラー:", error.message);
                });
        });




        // // 新しいユーザーを登録する関数
        // async function registerUser(email, password) {
        //     try {
        //         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        //         const user = userCredential.user;
        //         console.log("新しいユーザーが登録されました:", user.uid);
        //     } catch (error) {
        //         console.log("新規登録エラー:", error.message);
        //     }
        // }

        // ユーザーの新規登録をトリガーする例
        // const email = "example@example.com";
        // const password = "password123";
        // registerUser(email, password);