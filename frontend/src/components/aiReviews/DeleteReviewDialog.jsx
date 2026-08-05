import React from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

export const DeleteReviewDialog = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete AI Review
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this AI Review? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Review'}
          </Button>
        </DialogFooter>
    </Dialog>
  );
};
