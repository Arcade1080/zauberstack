import { Avatar, Box, Text, UnstyledButton } from '@mantine/core';
import { forwardRef } from 'react';
import classes from './UserButton.module.css';
import { getMediaUrl } from '../../../utils/utils';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  plan: string;
  email: string;
  condensed: boolean;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, plan, email, condensed, ...others }: UserButtonProps, ref) => (
    <UnstyledButton ref={ref} {...others}>
      <Box
        className={`${classes.container} ${condensed ? classes.condensed : ''}`}
      >
        <Avatar src={getMediaUrl(image)} radius="xl" />
        {!condensed && (
          <div style={{ flex: 1 }}>
            <Text size="sm">{email}</Text>
            <Text size="xs">{plan}</Text>
          </div>
        )}
      </Box>
    </UnstyledButton>
  ),
);

export default UserButton;
