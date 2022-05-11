import React from 'react';
import { DialogTitle, IconButton, Typography } from '@mui/material';
import { TwoScreenSpacedOptions } from 'components/Container';
import CollectionSort from 'components/Collections/AllCollections/CollectionSort';
import constants from 'utils/strings/constants';
import Close from '@mui/icons-material/Close';

export default function AllCollectionsHeader({
    onClose,
    collectionCount,
    collectionSortBy,
    setCollectionSortBy,
}) {
    return (
        <DialogTitle>
            <TwoScreenSpacedOptions>
                <Typography
                    css={`
                        font-size: 24px;
                        font-weight: 600;
                        line-height: 36px;
                    `}>
                    {constants.ALL_ALBUMS}
                </Typography>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </TwoScreenSpacedOptions>
            <TwoScreenSpacedOptions>
                <Typography
                    css={`
                        font-size: 24px;
                        font-weight: 600;
                        line-height: 36px;
                    `}
                    color={'text.secondary'}>
                    {`${collectionCount} ${constants.ALBUMS}`}
                </Typography>
                <CollectionSort
                    activeSortBy={collectionSortBy}
                    setCollectionSortBy={setCollectionSortBy}
                />
            </TwoScreenSpacedOptions>
        </DialogTitle>
    );
}
