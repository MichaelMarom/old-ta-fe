import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsFillPlayFill } from 'react-icons/bs';
import Modal from './Modal'


const TabInfoVideoToast = ({ video, iframeVideo = false, isOpen, setIsOpen }) => {
    const closeModal = () => {
        const video = document.getElementById('tabvideo');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        setIsOpen(false);
    };

    useEffect(() => {
        return () => {
            closeModal()
        }
    }, [])

    return (
        <>
            {/* <div className='d-flex justify-content-center align-items-center border border-light rounded'
                style={{ position: "fixed", top: '5px', right: "14%", zIndex: "999", height: "40px" }}
            >
                <div className='text-light text-sm' style={{ fontSize: "12px" }}>View Tutorial</div>
                <Button
                    variant="danger"
                    className='btn-sm'
                    onClick={() => setShowToast(true)}
                >
                    <BsFillPlayFill size={16} />
                </Button>
            </div> */}
            {video &&
                <Modal show={isOpen}
                    handleClose={closeModal} title={'Video'}>
                    <div>
                        {iframeVideo ?
                            <iframe width="470" height="315"
                                src={`${video}?rel=0`}
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            : <video id="tabvideo" controls style={{ width: "-webkit-fill-available" }}>
                                <source src={video} type="video/mp4"></source>
                            </video>
                        }
                    </div>
                </Modal>
            }

        </>
    );
};

export default TabInfoVideoToast;
