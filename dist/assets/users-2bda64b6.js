import{j as p,P as w}from"./index-29b1d87f.js";import{g as l,c as u}from"./apolloClient-3b54e56b.js";/*! js-cookie v3.0.5 | MIT */function g(s){for(var i=1;i<arguments.length;i++){var o=arguments[i];for(var t in o)s[t]=o[t]}return s}var h={read:function(s){return s[0]==='"'&&(s=s.slice(1,-1)),s.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(s){return encodeURIComponent(s).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};function f(s,i){function o(e,a,r){if(!(typeof document>"u")){r=g({},i,r),typeof r.expires=="number"&&(r.expires=new Date(Date.now()+r.expires*864e5)),r.expires&&(r.expires=r.expires.toUTCString()),e=encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var n="";for(var c in r)r[c]&&(n+="; "+c,r[c]!==!0&&(n+="="+r[c].split(";")[0]));return document.cookie=e+"="+s.write(a,e)+n}}function t(e){if(!(typeof document>"u"||arguments.length&&!e)){for(var a=document.cookie?document.cookie.split("; "):[],r={},n=0;n<a.length;n++){var c=a[n].split("="),d=c.slice(1).join("=");try{var m=decodeURIComponent(c[0]);if(r[m]=s.read(d,m),e===m)break}catch{}}return e?r[e]:r}}return Object.create({set:o,get:t,remove:function(e,a){o(e,"",g({},a,{expires:-1}))},withAttributes:function(e){return f(this.converter,g({},this.attributes,e))},withConverter:function(e){return f(g({},this.converter,e),this.attributes)}},{attributes:{value:Object.freeze(i)},converter:{value:Object.freeze(s)}})}var I=f(h,{path:"/"});p();const y=w("login",{state:()=>({isLoggedIn:!1,token:void 0,userStrObj:"",username:"",user:void 0}),actions:{async register(s,i,o,t){const e=l`
        mutation createUser(
          $username: String!
          $fullName: String!
          $email: String!
          $password: String!
        ) {
          createUser(
            email: $email
            username: $username
            fullName: $fullName
            password: $password
          ) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
            role
          }
        }
      `;try{const r=(await u.mutate({mutation:e,variables:{email:s,username:i,fullName:o,password:t}})).data.createUser;r&&(this.user=r,console.log({user:r})),window.location="/auth/activate"}catch(a){throw console.error("Error registering user:",a),new Error("Registration error")}},async login(s,i){var t,e,a,r;const o=l`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
                fullName
                publication_credits
              }
              role
            }
          }
        }
      `;try{const n=await u.mutate({mutation:o,variables:{email:s,password:i}}),c=(e=(t=n.data)==null?void 0:t.login)==null?void 0:e.user,d=(r=(a=n.data)==null?void 0:a.login)==null?void 0:r.accessToken;if(c&&d)this.isLoggedIn=!0,this.token=d,this.user=c,localStorage.setItem("sessionId",c.id);else throw new Error("Invalid email or password")}catch(n){throw console.error("Login error:",n),new Error("Login failed")}},async activate(s){var o,t,e,a;const i=l`
        mutation ActivateAccount($activationToken: String!) {
          activate(activationToken: $activationToken) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
                fullName
                publication_credits
              }
              role
            }
          }
        }
      `;try{const r=await u.mutate({mutation:i,variables:{activationToken:s}}),n=(t=(o=r.data)==null?void 0:o.activate)==null?void 0:t.user,c=(a=(e=r.data)==null?void 0:e.activate)==null?void 0:a.accessToken;if(n&&c)this.isLoggedIn=!0,this.token=c,this.user=n,localStorage.setItem("sessionId",n.id);else throw new Error("Invalid activation token")}catch(r){throw console.error("Activation error:",r),new Error("Account activation failed")}},async deleteUserByScholarId(s){var o;const i=l`
        mutation DeleteUserByScholarId($scholarId: String!) {
          deleteUserByScholarId(scholarId: $scholarId) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
          }
        }
      `;try{const e=(o=(await u.mutate({mutation:i,variables:{scholarId:s}})).data)==null?void 0:o.deleteUserByScholarId;if(e)return this.user=e,e;throw new Error("User not found or deletion failed")}catch(t){throw console.error("Delete user by scholar ID error:",t),new Error("User deletion failed")}},async singleSigninLogin(s){var o,t,e,a;const i=l`
        mutation SingleSigninLogin($accessKey: String!) {
          singleSigninLogin(accessKey: $accessKey) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
                fullName
                publication_credits
              }
              role
            }
          }
        }
      `;try{const r=await u.mutate({mutation:i,variables:{accessKey:s}}),n=(t=(o=r.data)==null?void 0:o.singleSigninLogin)==null?void 0:t.user,c=(a=(e=r.data)==null?void 0:e.singleSigninLogin)==null?void 0:a.accessToken;if(n&&c)this.isLoggedIn=!0,this.token=c,this.user=n,localStorage.setItem("sessionId",n.id);else throw new Error("Invalid access key")}catch(r){throw console.error("Single sign-in login error:",r),new Error("Single sign-in login failed")}},async singleSignInRequest(s){var o;const i=l`
        mutation SingleSignInRequest($email: String!) {
          singleSignInRequest(email: $email) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
          }
        }
      `;try{const e=(o=(await u.mutate({mutation:i,variables:{email:s}})).data)==null?void 0:o.singleSignInRequest;if(e)return this.user=e,e;throw new Error("Single sign-in request failed or invalid email")}catch(t){throw console.error("Single sign-in request error:",t),new Error("Single sign-in request failed")}},async requestPasswordReset(s){var o;const i=l`
        mutation RequestPasswordReset($email: String!) {
          requestPasswordReset(email: $email) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
          }
        }
      `;try{const e=(o=(await u.mutate({mutation:i,variables:{email:s}})).data)==null?void 0:o.requestPasswordReset;if(e)return this.user=e,e;throw new Error("User not found or invalid email")}catch(t){throw console.error("Password reset request error:",t),new Error("Password reset request failed")}},async resetPassword(s,i){var t,e,a,r;const o=l`
        mutation ResetPassword($activationToken: String!, $password: String!) {
          resetPassword(
            activationToken: $activationToken
            password: $password
          ) {
            accessToken
            user {
              id
              personalInfo {
                username
                email
                activatedAccount
                fullName
                publication_credits
              }
              role
            }
          }
        }
      `;try{const n=await u.mutate({mutation:o,variables:{activationToken:s,password:i}}),c=(e=(t=n.data)==null?void 0:t.resetPassword)==null?void 0:e.user,d=(r=(a=n.data)==null?void 0:a.resetPassword)==null?void 0:r.accessToken;if(c&&d)this.isLoggedIn=!0,this.token=d,this.user=c,localStorage.setItem("sessionId",c.id);else throw new Error("Invalid reset token or password")}catch(n){throw console.error("Reset password error:",n),new Error("Password reset failed")}},async getCurrentUser(s){var o;const i=l`
        query getCurrentUser($sessionId: String!) {
          getCurrentUser(sessionId: $sessionId) {
            id
            personalInfo {
              username
              email
              activatedAccount
              fullName
              publication_credits
            }
            role
            discussion_groups {
              id
              discussionGroupId
              name
              members {
                role
                personalInfo {
                  email
                  fullName
                }
              }
            }
            departments {
              id
              departmentId
              name
              faculty {
                role
                personalInfo {
                  email
                  fullName
                }
              }
              students {
                role
                personalInfo {
                  email
                  fullName
                }
              }
            }
            favorite_resources {
              id
              title
            }
            recent_resources {
              id
              title
            }
            suggested_resources {
              id
              title
            }
          }
        }
      `;try{const e=(o=(await u.query({query:i,variables:{sessionId:s}})).data)==null?void 0:o.getCurrentUser,r=JSON.stringify([e]);e&&(this.user=e,this.userStrObj=r)}catch(t){throw console.error("Fetch current user error:",t),new Error("Failed to fetch current user")}},logout(){this.isLoggedIn=!1,this.token=void 0,this.user=void 0,localStorage.clear(),I.remove("authToken"),window.location.href="/"}}});export{I as a,y as u};
