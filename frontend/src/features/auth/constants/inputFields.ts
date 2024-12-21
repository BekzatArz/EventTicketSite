import i18n from "../../../app/i18n";

export const registerFields = [
    { name: 'last_name', type: 'text', placeholder: i18n.t('form.lastName'), label: i18n.t('form.lastName') },
    { name: 'first_name', type: 'text', placeholder: i18n.t('form.firstName'), label: i18n.t('form.firstName') },
    { name: 'phone_number', type: 'text', placeholder: i18n.t('form.phoneNumber'), label: i18n.t('form.phoneNumber') },
    { name: 'email', type: 'email', placeholder: i18n.t('form.email'), label: i18n.t('form.email') },
    { name: 'password', type: 'password', placeholder: i18n.t('form.password'), label: i18n.t('form.password') },
];
export const adminRegisterFields = [
    { name: 'company_name', type: 'text', placeholder: i18n.t('form.companyName'), label: i18n.t('form.companyName') },
    { name: 'phone_number', type: 'text', placeholder: i18n.t('form.phoneNumber'), label: i18n.t('form.phoneNumber') },
    { name: 'email', type: 'email', placeholder: i18n.t('form.email'), label: i18n.t('form.email') },
    { name: 'password', type: 'password', placeholder: i18n.t('form.password'), label: i18n.t('form.password') },
]

export const loginFields = [
    { name: 'email', type: 'email', placeholder: i18n.t('form.email'), label: i18n.t('form.email') },
    { name: 'password', type: 'password', placeholder: i18n.t('form.password'), label: i18n.t('form.password') }
];