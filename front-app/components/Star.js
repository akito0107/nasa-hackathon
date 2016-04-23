import React from 'react'
import Modal from './Modal'

export default class Star extends React.Component {
    render() {
        // var modalNodes = this.props.data.map((modal)=> {
        //   return(<Modal name={modal.name}>{modal.color}</Modal>);
        // });
        // return(<div className='star'>{modalNodes}</div>);
        return(
            <!-- TODO: modal-blue, modal-title-blue, modal-contents-blue, modal-hr-blue, modal-button-blue は赤チームだったらそれぞれ xxx-red に書き換える -->
            <div className="modal star-modal modal-blue">
                <div className="modal-header">
                    <div className="modal-title modal-title-blue modal-title-left"><p>ベテルギウス - HIP: 27989</p></div>
                    <div className="modal-close"><p>×</p></div>
                </div>
                <div className="modal-body">
                    <div><p>Team: <span className="modal-contents-blue">Earth</span></p></div>
                    <div><p>Score: <span className="modal-contents-blue">10</span></p></div>
                    <div><p>オリオン座 を構成する星の1つです</p></div>
                    <hr className="modal-hr modal-hr-blue" />
                    <div className="modal-button modal-button-blue"><p>Hack</p></div>
                </div>
            </div>
        )
    }
}
