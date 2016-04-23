import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from 'styles/components/organisums/scout/sidebar.css'

class Menu extends Component {

  render() {
    return (
      <div className={styles.menu}>
        <h1 className={styles.title}>メニュー</h1>
        <div className={styles.container}>
          なんらかの要素
        </div>
        <div className={styles.container}>
          なんらかの要素
        </div>
        <div className={styles.container}>
          なんらかの要素
        </div>
        <div className={styles.container}>
          なんらかの要素
        </div>
      </div>
    )
  }
}

Menu.propTypes = {
}

export default Menu
