import type { PolicyCmsBlock } from './policies-cms';

const h = (text: string): PolicyCmsBlock => ({ type: 'heading', text, items: [] });
const p = (text: string): PolicyCmsBlock => ({ type: 'paragraph', text, items: [] });
const ul = (items: string[]): PolicyCmsBlock => ({ type: 'list', text: '', items });

export const DELETE_ACCOUNT_KEY = 'delete-account';

export const DELETE_ACCOUNT = {
  seo: { title: 'Delete account | Teamital', description: 'How to request deletion of your Teamital account.' },
  appBarTitle: 'Delete account',
  title: 'Delete Your Teamital Account',
  emailLabel: 'Email: ',
  mailAfterBlock: 4,
  mailSubject: 'Teamital — Account deletion request',
  blocks: [
    p('If you would like to delete your Teamital account and associated personal data, you can submit a deletion request using the instructions below.'),
    h('How to request account deletion'),
    p('Please contact us using the email address associated with your Teamital account and request that your account be deleted.'),
    p('Please include:'),
    ul(['Your registered email address or username', 'Your request to delete your Teamital account']),
    p('We may ask you to verify your identity before processing the request.'),
    h('What happens when your account is deleted?'),
    p('When your account deletion request is processed:'),
    ul([
      'Your Teamital account will be permanently deleted.',
      'Personal information associated with your account will be deleted.',
      'Employee/profile information associated with your account will be deleted.',
      'Any other data that is not required to be retained for legitimate legal or security purposes will be deleted.',
    ]),
    p('Some information may be retained for a limited period when required by law, for fraud prevention, security, accounting, or other legitimate legal purposes. Any retained information will be securely stored and deleted when the applicable retention requirement expires.'),
    h('Account deletion is permanent'),
    p('Account deletion is permanent and cannot be undone. Once your account and associated data have been deleted, they cannot be recovered.'),
    p('If you have questions about account deletion or your data, please contact us at:'),
  ],
};
