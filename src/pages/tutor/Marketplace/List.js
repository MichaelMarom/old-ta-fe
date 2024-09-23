import React from 'react'
import ListComponent from '../../../components/tutor/Ads/ListComponent'
import Layout from './Layout'
import Actions from '../../../components/common/Actions'

const List = () => {
    return (
        <Layout>
            <ListComponent />
            <Actions saveDisabled />
        </Layout>
    )
}

export default List