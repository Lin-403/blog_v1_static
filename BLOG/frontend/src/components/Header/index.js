import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import './header_index.css'

class Header extends PureComponent {
    render() {
        const { appName, currentUser } = this.props
        if (currentUser) {
            return (
                <nav className='nav_main'>
                    <div className='nav_container'>
                        {/* 左边 */}
                        <Link to="/" className='nav_left'>
                            {appName}{' '}<i class="fa fa-spin fa-eercast"></i> 
                        </Link>

                        <ul className="nav_right">
                            <li className="nav-item">
                                <Link to='/' className='nav-link'><i class="fa fa-home"></i>{' '}主页</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/article/new' className='nav-link'><i class="fa fa-file-text-o"></i>{' '}文章</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/setting' className='nav-link'><i class="fa fa-spin fa-asterisk"></i>{' '}设置</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={`/${currentUser.username}/profile`} className='nav-link'>
                                    <img class="nav_img" src={currentUser.avatar  || 'https://lin-403.github.io/blog_v1_static/default_avatar.jpg'} />
                                </Link>
                            </li>
                        </ul>

                        {/* 右边 */}

                    </div>
                </nav>
            )
        }
        else {
            return (
                <nav className='nav_main'>
                    <div className='nav_container'>
                        {/* 左边 */}
                        <Link to="/" className='nav_left'>
                            {appName}
                        </Link>
                        <ul className="nav_right">
                            <li className="nav-item">
                                <Link to='/' className='nav-link'><i class="fa fa-home"></i>{' '}主页</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/login' className='nav-link'><i class="fa fa-user-circle-o"></i>{' '}登录</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/regist' className='nav-link'><i class="fa fa-user-secret"></i>{' '}注册</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/profile' className='nav-link'>
                                    {/* <img class="nav_img" src={currentUser.avatar  || 'https://lin-403.github.io/blog_v1_static/default_avatar.jpg'} /> */}
                                </Link>
                            </li>
                        </ul>

                        {/* 右边 */}

                    </div>
                </nav>
            )
        }
    }
}

export default Header