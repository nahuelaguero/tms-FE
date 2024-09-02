import { createServer } from 'miragejs';

export function makeServer() {
    return createServer({
        routes() {
            this.namespace = 'api';

            this.get('/form', () => ({
                pages: [
                    {
                        title: 'Interest Submission Form',
                        fields: [
                            { name: 'fullName', label: 'Full Name', type: 'text', required: true },
                            { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Non-binary'], required: true },
                        ],
                    },
                    {
                        title: 'Professional Information',
                        fields: [
                            { name: 'profession', label: 'Profession', type: 'select', options: ['Owner', 'Agent', 'Buyer', 'Seller'], allowCustom: true, required: true },
                            { name: 'skills', label: 'Skills', type: 'multi-select', options: ['JavaScript', 'React', 'Node.js', 'Python'], allowCustom: true, required: false },
                            { name: 'services', label: 'What services do you need?', type: 'text', required: false },
                        ],
                    },
                ],
                timeoutMinutes: 30,
            }));

            this.post('/submit', (schema, request) => {
                const attrs = JSON.parse(request.requestBody);
                return { success: true, data: attrs };
            });
        },
    });
}
