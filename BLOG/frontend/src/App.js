
import React,{PureComponent,lazy,Suspense} from 'react'
import {Switch,Route, BrowserRouter} from 'react-router-dom'
import Header from './components/Header/index'
import Home from './pages/Home/index'
// import Login from './components/Login/index'
// import Regist from './pages/Regist/index'
import ProfileFaorite from './pages/Profile/ProfileFavorite'
import ArticleNew from './pages/ArticleNew'
import './App.css'

const Login=lazy(()=>
  import('./pages/Login/index.js')
)

const Regist=lazy(()=>
  import('./pages/Regist/index')
)

const Setting=lazy(()=>
  import('./pages/Setting/index')
)
const Article=lazy(()=>
  import('./pages/Article/index')
)
const Profile=lazy(()=>
  import('./pages/Profile/index')
)


class App extends PureComponent{
  constructor(props){
    super(props)
  }
  render(){
    const appName="Blog_v1"
    const currentUser={
      username:'test1',
      avatar:'http://localhost:8000/static/test.jpg',
      bio:'user info'
    }
    // const currentUser=null
    return (
      <div>
        <Header appName={appName} currentUser={currentUser}></Header>
        <Suspense fallback={<p>Loading。。。</p>}>
          <Switch>
              <Route path="/" component={Home} exact/>
              <Route path="/login" component={Login}/>
              <Route path="/regist" component={Regist}/>
              <Route path="/setting" component={Setting}/>
              <Route path="/article/new" component={ArticleNew} exact/>
              <Route path="/article" component={Article}/>
              <Route path="/:username/profile" component={Profile}/>
              <Route path="/:username/favorites" component={ProfileFaorite}/>

          </Switch>
        </Suspense>
      </div>
    )
  }
}

export default App;
