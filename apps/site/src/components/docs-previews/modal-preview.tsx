'use client';

import { useState } from 'react';
import { Button, Modal } from '8bit-ui';

export const ModalPreview = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        <Modal.Header title="Delete Item" onClose={() => setIsOpen(false)} />
        <Modal.Body>This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="link" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" color="danger" onClick={() => setIsOpen(false)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
