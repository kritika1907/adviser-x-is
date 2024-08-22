import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, EmailIcon } from 'react-share';
import CloseIcon from '@mui/icons-material/Close';

const ShareDialog = ({ open, handleClose, url }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Share this post
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className='flex space-x-4'>
        <div>
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        </div>

        <div>
        <TwitterShareButton url={url}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        </div>

        <div>
        <WhatsappShareButton url={url} >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        </div>

        <div>
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        </div>

        
        <div>
        <EmailShareButton url={url}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        </div>
        </div>
      </DialogContent>
      {/* <DialogActions>
        <button onClick={handleClose}>Close</button>
      </DialogActions> */}
    </Dialog>
  );
};

export default ShareDialog;
