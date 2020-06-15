const transformerPluginPath = 'native';
const defaultRelativePluginPath = '../..';
const excelExtractorPluginPath = `${defaultRelativePluginPath}/jazz-plugin-excelextractor/dist`;
const textLoaderPluginPath = `${defaultRelativePluginPath}/jazz-plugin-textloader/dist`;

module.exports = {
  pipeline: [
    `${excelExtractorPluginPath}:jazz-plugin-excelextractor:extract`,
    `${excelExtractorPluginPath}:jazz-plugin-excelextractor:validate`,
    `${transformerPluginPath}:Transformer:transform`,
    `${textLoaderPluginPath}:jazz-plugin-textloader:load`,
  ],
  plugins: [
    {
      name: 'jazz-plugin-excelextractor',
      sheet: 'source',
    },
    {
      name: 'Transformer',
      groupIdColumn: 'groupid',
      tasks: {
        transform: {
          rawDataFrom: 'extract',
        },
      },
    },
    {
      name: 'jazz-plugin-textloader',
      tasks: {
        load: {
          rawDataFrom: 'transform',
        },
      },
    },
  ],

  userInputParameters: {
    customer_country_code: {
      alias: 'ccc',
      describe: 'Customer Country Code',
      demandOption: false,
      default: '320',
    },
    customer_account_currency_code: {
      alias: 'cacc',
      describe: 'Customer Account Currency Code',
      demandOption: false,
      default: 'GTQ',
    },
  },

  groups: [
    {
      id: 'main',
      sizeMode: 'fixed',
      data: {
        hasHeader: false,
        hasDetail: true,
        detailGroup: 'pay',
        hasTrailer: true,
        trailer: {
          columns: [
            {
              id: 'record_type',
              description: 'Record Type',
              required: 'on',
              type: 'text',
              size: 3,
              defaultValue: 'TRL',
            },

            {
              id: 'number_of_transactions',
              description: 'Number of Transactions',
              required: 'on',
              type: 'number',
              size: 15,
              fillMode: 'zeros_on_left',
              transformType: 'calculation',
              transform: {
                calcCondition: ({ groupid }) => groupid === 'pay',
                calculationType: 'count',
              },
            },
            {
              id: 'total_transaction_amount',
              description: 'Total Transaction Amount',
              required: 'on',
              type: 'number',
              size: 15,
              fillMode: 'zeros_on_left',
              removeDecimalChars: true,
              numberOfDecimalDigits: 2,
              transformType: 'calculation',
              transform: {
                calculationType: 'sum',
                source: 'amount',
              },
            },

            {
              id: 'number_of_third_party_records',
              description: 'Number of Third Party Records',
              required: 'on',
              type: 'text',
              size: 15,
              fillMode: 'zeros_on_left',
              defaultValue: '0',
            },

            {
              id: 'number_of_records_sent',
              description: 'Number of Records Sent',
              required: 'on',
              type: 'number',
              size: 15,
              fillMode: 'zeros_on_left',
              transformType: 'calculation',
              transform: {
                calculationType: 'count',
              },
            },

            {
              id: 'placeholder',
              description: 'Trailer Placeholder',
              required: 'on',
              type: 'text',
              size: 36,
              empty: true,
            },
          ],
        },
      },
    },
    {
      id: 'pay',
      parent: 'main',
      sizeMode: 'fixed',
      data: {
        hasHeader: false,
        hasTrailer: false,
        hasDetail: true,
        detail: {
          columns: [
            {
              id: 'record_type',
              description: 'Record Type',
              required: 'on',
              type: 'text',
              size: 3,
              defaultValue: 'PAY',
            },
            {
              id: 'customer_country_code',
              description: 'Customer Country Code',
              required: 'on',
              type: 'text',
              transformType: 'input',
              defaultValue: '320',
              size: 3,
            },
            {
              id: 'customer_account_number',
              description: 'Customer Account Number',
              required: 'on',
              type: 'text',
              size: 10,
              transformType: 'source',
              fillMode: 'spaces_at_end',
              transform: {
                source: 'customer_account_number',
              },
            },
            {
              id: 'transaction_date',
              description: 'Transaction Date',
              required: 'on',
              type: 'date',
              dateFormat: 'ddMMyy',
              size: 6,
              transformType: 'source',
              transform: {
                source: 'transaction_date',
              },
            },
            {
              id: 'transaction_code',
              description: 'Transaction Code',
              required: 'on',
              type: 'text',
              size: 3,
              fillMode: 'zeros_on_left',
              transformType: 'source',
              transform: {
                source: 'transaction_code',
              },
            },
            {
              id: 'transaction_reference',
              description: 'Transaction Reference',
              required: 'on',
              type: 'text',
              size: 15,
              fillMode: 'zeros_on_left',
              defaultValue: '1',
            },
            {
              id: 'transaction_sequence_number',
              description: 'Transaction Sequence Number',
              required: 'on',
              type: 'text',
              size: 8,
              transformType: 'sequence',
              fillMode: 'zeros_on_left',
            },
            {
              id: 'third_party_tax_id',
              description: 'Thirdy Party Tax Id',
              required: 'on',
              type: 'text',
              size: 20,
              excludeChars: ['-', '.', '/'],
              transformType: 'source',
              transform: {
                source: 'employee_tax_id',
              },
            },
            {
              id: 'customer_account_currency_code',
              description: 'Customer Account Currency Code',
              required: 'on',
              type: 'text',
              size: 3,
              transformType: 'input',
              defaultValue: 'GTQ',
            },
            {
              id: 'third_party_code',
              description: 'Thirdy Party Code',
              required: 'on',
              type: 'text',
              size: 20,
              removeAccents: true,
              removeSpecialChars: true,
              caseType: 'upper',
              transformType: 'source',
              transform: {
                source: 'employee_id',
              },
            },
            {
              id: 'transaction_amount',
              description: 'Transaction Amount',
              required: 'on',
              type: 'number',
              size: 15,
              removeDecimalChars: true,
              numberOfDecimalDigits: 2,
              transformType: 'source',
              fillMode: 'zeros_on_left',
              transform: {
                source: 'amount',
              },
            },
            {
              id: 'maturity_date',
              description: 'Maturity Date',
              required: 'off',
              type: 'date',
              size: 6,
              empty: true,
            },
            {
              id: 'transaction_details_line_1',
              description: 'Transaction Details Line 1',
              required: 'off',
              type: 'text',
              size: 35,
              empty: true,
            },
            {
              id: 'transaction_details_line_2',
              description: 'Transaction Details Line 2',
              required: 'off',
              type: 'text',
              size: 35,
              empty: true,
            },
            {
              id: 'transaction_details_line_3',
              description: 'Transaction Details Line 3',
              required: 'off',
              type: 'text',
              size: 35,
              empty: true,
            },
            {
              id: 'transaction_details_line_4',
              description: 'Transaction Details Line 4',
              required: 'off',
              type: 'text',
              size: 35,
              empty: true,
            },
            {
              id: 'local_transaction_code',
              description: 'Local Transaction Code',
              required: 'on',
              type: 'text',
              size: 2,
              defaultValue: '03',
            },
            {
              id: 'customer_account_type',
              description: 'Customer_Account_Type',
              required: 'on',
              type: 'text',
              size: 2,
              defaultValue: '01',
            },

            {
              id: 'third_party_name',
              description: 'Thirdy Party Name',
              required: 'on',
              type: 'text',
              size: 80,
              removeSpecialChars: true,
              removeAccents: true,
              transformType: 'source',
              caseType: 'upper',
              transform: {
                source: 'employee_name',
              },
            },
            {
              id: 'third_party_address',
              description: 'Thirdy Party Address',
              required: 'on',
              type: 'text',
              size: 35,
              removeSpecialChars: true,
              removeAccents: true,
              transformType: 'source',
              transform: {
                source: 'employee_address',
              },
            },

            {
              id: 'third_party_address_second_line',
              description: 'Thirdy Party Address - Second Line',
              required: 'off',
              type: 'text',
              size: 35,
              empty: true,
            },

            {
              id: 'third_party_address_2',
              description: 'Thirdy Party Address 2',
              required: 'off',
              type: 'text',
              size: 15,
              empty: true,
            },

            {
              id: 'third_party_state',
              description: 'Thirdy Party State',
              required: 'off',
              type: 'text',
              size: 2,
              empty: true,
            },

            {
              id: 'third_party_address_3',
              description: 'Thirdy Party Address 3',
              required: 'off',
              type: 'text',
              size: 12,
              empty: true,
            },

            {
              id: 'third_party_phone_number',
              description: 'Thirdy Party Phone Number',
              required: 'off',
              type: 'text',
              size: 16,
              empty: true,
            },

            {
              id: 'third_party_bank_number',
              description: 'Thirdy Party Bank Number',
              required: 'on',
              type: 'text',
              size: 3,
              transformType: 'mapping',
              transform: {
                sourceOnMappingTable: 'code',
                caseSensitive: false,
                mappingData: require('./mappings/banks.json'),
                tableName: 'banks',
                mappingKeys: [{ key: 'name', source: 'bankname' }],
                useOriginalOnNotFound: true,
                errorOnMultiple: true,
              },
            },

            {
              id: 'third_party_agency',
              description: 'Thirdy Party Agency',
              required: 'on',
              type: 'text',
              size: 8,
              fillMode: 'spaces_at_end',
              defaultValue: '0001',
            },

            {
              id: 'third_party_account_number',
              description: 'Thirdy Party Account Number (for Non-Citibank Accounts)',
              required: 'on',
              type: 'text',
              size: 35,
              excludeChars: ['-'],
              fillMode: 'spaces_at_end',
              fillCondition: ({ transaction_code }) => transaction_code == '71',
              transformType: 'source',
              transform: {
                source: 'account',
              },
            },

            {
              id: 'third_party_account_type',
              description: 'Thirdy Party Account Type',
              required: 'off',
              type: 'text',
              size: 2,
              fillCondition: ({ transaction_code }) => transaction_code == '71',
              defaultValue: '01',
            },

            {
              id: 'third_party_bank_address',
              description: 'Thirdy Party Bank Address',
              required: 'off',
              type: 'text',
              size: 30,
              empty: true,
            },

            {
              id: 'third_party_bank_entity',
              description: 'Thirdy Party Bank Entity',
              required: 'off',
              type: 'text',
              size: 2,
              empty: true,
            },

            {
              id: 'third_party_place_number',
              description: 'Thirdy Party Place Number',
              required: 'off',
              type: 'text',
              size: 3,
              empty: true,
            },

            {
              id: 'third_party_place_name',
              description: 'Thirdy Party Place Name',
              required: 'off',
              type: 'text',
              size: 14,
              empty: true,
            },

            {
              id: 'third_party_branch_number',
              description: 'Thirdy Party Branch Number',
              required: 'off',
              type: 'text',
              size: 3,
              empty: true,
            },

            {
              id: 'third_party_branch_name',
              description: 'Thirdy Party Branch Name',
              required: 'off',
              type: 'text',
              size: 19,
              empty: true,
            },

            {
              id: 'third_party_fax_number',
              description: 'Thirdy Party Fax Number',
              required: 'off',
              type: 'text',
              size: 16,
              empty: true,
            },

            {
              id: 'third_party_fax_contact_name',
              description: 'Thirdy Party Fax Contact Name',
              required: 'off',
              type: 'text',
              size: 20,
              empty: true,
            },

            {
              id: 'third_party_fax_department_name',
              description: 'Thirdy Party Fax Department Name',
              required: 'off',
              type: 'text',
              size: 15,
              empty: true,
            },

            {
              id: 'third_party_account_number_2',
              description: 'Thirdy Party Account Number (for Citibank Accounts)',
              required: 'cond',
              type: 'text',
              size: 10,
              excludeChars: ['-'],
              fillMode: 'spaces_at_end',
              fillCondition: ({ transaction_code }) => transaction_code == '72',
              transformType: 'source',
              transform: {
                source: 'account',
              },
            },

            {
              id: 'account_type_2',
              description: 'Account Type (for Citibank Accounts)',
              required: 'cond',
              type: 'text',
              size: 2,
              fillCondition: ({ transaction_code }) => transaction_code == '72',
              defaultValue: '01',
            },

            {
              id: 'transaction_delivery_method',
              description: 'Transaction Delivery Method',
              required: 'on',
              type: 'text',
              size: 3,
              defaultValue: '001',
            },

            {
              id: 'collection_title_id',
              description: 'Transaction Delivery Method',
              required: 'off',
              type: 'text',
              size: 50,
              empty: true,
            },

            {
              id: 'third_party_activity_code',
              description: 'Third Party Activity Code',
              required: 'off',
              type: 'text',
              size: 5,
              empty: true,
            },

            {
              id: 'third_party_email_address',
              description: 'Third Party Email Address',
              required: 'off',
              type: 'text',
              size: 50,
              empty: true,
            },

            {
              id: 'maximum_payment_amount',
              description: 'Maximum_Payment_Amount',
              required: 'on',
              type: 'number',
              size: 15,
              defaultValue: '999999999999999',
            },

            {
              id: 'update_type',
              description: 'Update Type',
              required: 'on',
              type: 'text',
              size: 1,
              transformType: 'source',
              transform: {
                source: 'update_type',
              },
            },

            {
              id: 'check_or_transference_number',
              description: 'Check Or Transference Number',
              required: 'off',
              type: 'text',
              size: 11,
              empty: true,
            },

            {
              id: 'printed_check_flag',
              description: 'Printed Check Flag',
              required: 'off',
              type: 'text',
              size: 1,
              empty: true,
            },

            {
              id: 'match_pay_flag',
              description: 'Match Pay Flag',
              required: 'off',
              type: 'text',
              size: 1,
              empty: true,
            },

            {
              id: 'blanks',
              description: 'Blank Characters',
              required: 'off',
              type: 'text',
              size: 1,
              empty: true,
            },
          ],
        },
      },
    },
    {
      id: 'voi',
      parent: 'pay',
      sizeMode: 'fixed',
      data: {
        hasHeader: false,
        hasTrailer: false,
        hasDetail: true,
        detail: {
          columns: [
            {
              id: 'record_type',
              description: 'Record Type',
              required: 'on',
              type: 'text',
              size: 3,
              defaultValue: 'VOI',
            },

            {
              id: 'customer_country_code',
              description: 'Customer Country Code',
              required: 'on',
              type: 'text',
              transformType: 'input',
              size: 3,
              defaultValue: '320',
            },

            {
              id: 'customer_account_number',
              description: 'Customer Account Number',
              required: 'on',
              type: 'text',
              size: 10,
              transformType: 'parent',
              transform: {
                groupId: 'pay',
                sectionId: 'detail',
                source: 'customer_account_number',
              },
            },

            {
              id: 'transaction_reference',
              description: 'Transaction Reference',
              required: 'on',
              type: 'text',
              size: 15,
              fillMode: 'zeros_on_right',
              transformType: 'parent',
              transform: {
                groupId: 'pay',
                sectionId: 'detail',
                source: 'transaction_reference',
              },
            },

            {
              id: 'transaction_sequence_number',
              description: 'Transaction Sequence Number',
              required: 'on',
              type: 'text',
              size: 8,
              fillMode: 'zeros_on_left',
              transformType: 'parent',
              transform: {
                groupId: 'pay',
                sectionId: 'detail',
                source: 'transaction_sequence_number',
              },
            },

            {
              id: 'sub_sequence',
              description: 'Sub-sequence',
              required: 'on',
              type: 'number',
              size: 4,
              fillMode: 'zeros_on_left',
              transformType: 'sequence',
              transform: {
                groupId: 'pay',
                sectionId: 'detail',
              },
            },

            {
              id: 'invoice_detail_description',
              description: 'Invoice Detail Description',
              required: 'on',
              type: 'text',
              size: 75,
              transformType: 'source',
              caseType: 'upper',
              removeAccents: true,
              removeSpecialChars: true,
              transform: {
                source: 'invoice_detail',
              },
            },

            {
              id: 'blanks',
              description: 'placeholder',
              required: 'on',
              type: 'text',
              size: 1,
              empty: true,
            },
          ],
        },
      },
    },
  ],
};
