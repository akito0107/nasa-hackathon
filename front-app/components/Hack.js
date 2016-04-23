import React from 'react'

export default class Hack extends React.Component {
    render() {
        return(
            <!-- TODO: modal-blue, modal-title-blue, modal-contents-blue, modal-hr-blue, modal-button-blue は赤チームだったらそれぞれ xxx-red に書き換える -->
            <div className="modal modal-blue">
                <div className="modal-header">
                    <div className="modal-title modal-title-blue"><p>Action</p></div>
                </div>
                <div className="modal-body">
                    <div><p className="modal-contents-big modal-contents-blue">Hack!!!</p></div>
                    <hr className="modal-hr modal-hr-blue" />
                    <div className="modal-button modal-button-blue"><p>Close</p></div>
                </div>
            </div>
        );
    }
}
