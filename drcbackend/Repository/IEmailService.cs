using drcbackend.Models;

namespace drcbackend.Repository
{
    public interface IEmailService
    {
        bool SendMail(ContactRequest Email_Data);
    }
}
