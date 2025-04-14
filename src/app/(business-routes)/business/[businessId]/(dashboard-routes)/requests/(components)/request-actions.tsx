'use client';

import { useState } from 'react';
import {
  CalendarDays,
  CheckCircle,
  Loader2,
  MoreHorizontal,
  Text,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';

import Badge from '@/components/ui/badge';
import InputWrapper from '@/components/ui/input-wrapper';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PopulatedRequest } from './requests-columns';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { acceptRequest as acceptRequestAction } from '@/actions/request/accept-request';
import { rejectRequest as rejectRequestAction } from '@/actions/request/reject-request';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type RequestActionsProps = {
  requestData: PopulatedRequest;
};

const RequestActions = ({ requestData }: RequestActionsProps) => {
  // Handle dropdown open state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Handle dialog open state
  const [reviewDialogOpen, setReviewDialogOpen] = useState<boolean>(false);
  // Comment created by "Reviewer"
  const [comments, setComments] = useState<string>('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
    null
  );
  const { businessId } = useParams<{ businessId: string }>();

  const { mutate: acceptRequest, isPending: isAccepting } =
    useServerActionMutation(acceptRequestAction, {
      mutationKey: ['accept-request'],
      onSuccess: () => {
        toast.success('Request accepted successfully');
        setReviewDialogOpen(false);
      },
      onError: error =>
        toast.error('Failed to accept request', {
          description: error?.message || 'Please try again.',
        }),
    });
  const { mutate: rejectRequest, isPending: isRejecting } =
    useServerActionMutation(rejectRequestAction, {
      mutationKey: ['reject-request'],
      onSuccess: () => {
        toast.success('Request rejected successfully');
        setReviewDialogOpen(false);
      },
      onError: error =>
        toast.error('Failed to reject request', {
          description: error?.message || 'Please try again.',
        }),
    });
  const isLoading = isAccepting || isRejecting;

  const handleOpenReview = (action: 'approve' | 'reject') => {
    setActionType(action);
    setReviewDialogOpen(true);
    setIsOpen(false);
  };

  const handleSubmitAction = () => {
    if (!requestData || !actionType) return;

    const { id: requestId, type } = requestData;

    // Prepare the extraData based on request type
    let extraData: any = { createdBy: requestData.createdBy };

    switch (type) {
      case 'SWAP':
        extraData = {
          ...extraData,
          originalShiftId: requestData.swapRequest?.originalShiftId,
          requestedShiftId: requestData.swapRequest?.requestedShiftId,
        };
        break;
      case 'VACATION':
        extraData = {
          ...extraData,
          startDate: requestData.vacationRequest?.startDate,
          endDate: requestData.vacationRequest?.endDate,
          date: requestData.vacationRequest?.startDate,
        };
        break;
      case 'UNAVAILABLE':
        extraData = {
          ...extraData,
          startDate: requestData.unavailableRequest?.startDate,
          endDate: requestData.unavailableRequest?.endDate,
          date: requestData.unavailableRequest?.startDate,
        };
        break;
    }

    // Execute the appropriate action
    if (actionType === 'approve') {
      acceptRequest({
        requestId,
        businessId,
        type,
        comments,
        extraData,
      });
    } else {
      rejectRequest({
        requestId,
        businessId,
        type,
        extraData,
      });
    }
  };

  // Format the request details for display
  const formatRequestDetails = () => {
    switch (requestData.type) {
      case 'SWAP':
        return (
          <div className='space-y-2'>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <p className='text-muted-foreground'>Type</p>
              <div>
                <Badge color='orange'>Shift Swap</Badge>
              </div>
            </div>
          </div>
        );
      case 'VACATION':
        return (
          <div className='space-y-2'>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <p className='text-muted-foreground'>Type</p>
              <div>
                <Badge color='orange'>Vacations</Badge>
              </div>
              <p className='text-muted-foreground'>Start Date</p>
              <p>
                {format(
                  requestData.vacationRequest?.startDate || new Date(),
                  'PPP'
                )}
              </p>
              <p className='text-muted-foreground'>End Date</p>
              <p>
                {format(
                  requestData.vacationRequest?.endDate || new Date(),
                  'PPP'
                )}
              </p>
              <p className='text-muted-foreground'>Total days</p>
              <p>{requestData.vacationRequest?.totalDays}</p>
            </div>
          </div>
        );
      case 'UNAVAILABLE':
        return (
          <div className='space-y-2'>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <p className='text-muted-foreground'>Type</p>
              <div>
                <Badge color='orange'>Unavailability</Badge>
              </div>
              <p className='text-muted-foreground'>Start Date</p>
              <p>
                {format(
                  requestData.unavailableRequest?.startDate || new Date(),
                  'PPP'
                )}
              </p>
              <p className='text-muted-foreground'>End Date</p>
              <p>
                {format(
                  requestData.unavailableRequest?.endDate || new Date(),
                  'PPP'
                )}
              </p>
            </div>
          </div>
        );
      default:
        return <p>Unknown request type</p>;
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='rounded-lg border border-transparent hover:bg-background hover:border-border data-[state=open]:bg-background data-[state=open]:border-border transition-transform'
          >
            <MoreHorizontal className='size-4 text-muted-foreground' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' side='bottom'>
          <DropdownMenuItem
            onSelect={e => {
              e.preventDefault();
              handleOpenReview('approve');
            }}
            disabled={isLoading}
          >
            <Text className='size-3.5 mr-1' />
            Review request
          </DropdownMenuItem>

          {requestData.status === 'PENDING' && (
            <>
              <DropdownMenuSeparator />
              {/* Approve btn */}
              <DropdownMenuItem
                onSelect={e => {
                  e.preventDefault();
                  handleOpenReview('approve');
                }}
                className='hover:text-green-400 hover:[&_svg]:stroke-green-400'
                disabled={isLoading}
              >
                {isAccepting ? (
                  <Loader2 className='size-3.5 mr-1 animate-spin' />
                ) : (
                  <CheckCircle className='size-3.5 mr-1' />
                )}
                Approve
              </DropdownMenuItem>
              {/* Reject btn */}
              <DropdownMenuItem
                onSelect={e => {
                  e.preventDefault();
                  handleOpenReview('reject');
                }}
                className='hover:text-red-400 hover:[&_svg]:stroke-red-400'
                disabled={isLoading}
              >
                {isRejecting ? (
                  <Loader2 className='size-3.5 mr-1 animate-spin' />
                ) : (
                  <XCircle className='size-3.5 mr-1' />
                )}
                Reject
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-4'>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Request
              {requestData.status === 'APPROVED' && (
                <Badge color='green'>Approved</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Review the request details before making a decision. The employee
              will be notified as soon as you submit.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 px-1'>
            <h2 className='font-medium'>Review Information</h2>
            <div className='flex items-center gap-3'>
              <Avatar className='size-12'>
                <AvatarImage
                  src={requestData.employee.user.image || undefined}
                  alt={requestData.employee.user.fullName || 'Employee image'}
                />
                <AvatarFallback>
                  {requestData.employee.user.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>
                  {requestData.employee.user.fullName}
                </p>
                <p className='text-xs text-muted-foreground'>
                  <CalendarDays className='h-3 w-3 inline mr-1' />
                  Requested {format(requestData.createdAt, 'PPP')}
                </p>
              </div>
            </div>
            {formatRequestDetails()}
          </div>

          {requestData.status === 'PENDING' && (
            <InputWrapper inputId='comments' label='Comments (Optional)'>
              <Textarea
                id='comments'
                placeholder='Add any comments about this request...'
                value={comments}
                onChange={e => setComments(e.target.value)}
                className='resize-none max-h-24'
                rows={5}
              />
            </InputWrapper>
          )}

          <DialogFooter className='mt-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setReviewDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {requestData.status === 'PENDING' && (
              <Button
                onClick={handleSubmitAction}
                disabled={isLoading}
                variant={actionType === 'approve' ? 'default' : 'destructive'}
                size='sm'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : actionType === 'approve' ? (
                  'Approve Request'
                ) : (
                  'Reject Request'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestActions;
