module.exports = {
  rules: {
    // Block versioned import specifiers like "@radix-ui/react-dialog@1.1.6"
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ImportDeclaration[source.value=/@radix-ui\\/.*@\\d/] ',
        message: 'Do not pin versions in import specifiers. Use package.json to manage versions.'
      },
      {
        selector: 'ImportDeclaration[source.value=/sonner@\\d|lucide-react@\\d|clsx@\\d|tailwind-merge@\\d/] ',
        message: 'Do not pin versions in import specifiers. Use package.json to manage versions.'
      }
    ],
  },
};
