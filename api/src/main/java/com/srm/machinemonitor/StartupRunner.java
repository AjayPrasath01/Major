package com.srm.machinemonitor;

import com.srm.machinemonitor.Models.Tables.Organizations;
import com.srm.machinemonitor.Models.Tables.SuperAdmins;
import com.srm.machinemonitor.Models.Tables.Users;
import com.srm.machinemonitor.Services.SuperAdminsDAO;
import com.srm.machinemonitor.Services.UsersDAO;
import com.srm.machinemonitor.Services.OrganizationDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;

@Component
@CacheConfig(cacheNames = {"monitor"})
public class StartupRunner implements CommandLineRunner {

    @Value("${defaultUsersname}")
    String DefaultUsername;

    @Value("${defaultPassword}")
    String DefaultUserPassword;

    @Value("${defaultOrganization}")
    String DefaultOrganization;

    @Value("${defaultSuperAdmin}")
    String DefaultSuperAdminName;

    @Value("${defaultSuperAdminPassword}")
    String DefaultSuperAdminPassword;

    @Value("${defaultAdminEmail}")
    String DefaultAdminEmail;

    @Autowired
    private UsersDAO usersDAO;

    @Autowired
    private OrganizationDAO organizationDAO;

    @Autowired
    PasswordEncoder passwordEncoder;;

    @Autowired
    SuperAdminsDAO superAdminsDAO;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        Users users = usersDAO.findByUsernameAndOrganizationName(DefaultUsername, DefaultOrganization);
        SuperAdmins superAdmin = superAdminsDAO.findByUsername(DefaultSuperAdminName);
        Organizations organizations = organizationDAO.findByName(DefaultOrganization);

        // For spring batch
        jdbcTemplate.execute("DROP TABLE IF EXISTS BATCH_JOB_EXECUTION_CONTEXT CASCADE");
        jdbcTemplate.execute("DROP TABLE IF EXISTS BATCH_JOB_EXECUTION_PARAMS CASCADE");
        jdbcTemplate.execute("DROP TABLE IF EXISTS BATCH_STEP_EXECUTION_CONTEXT CASCADE");
        jdbcTemplate.execute("DROP TABLE IF EXISTS BATCH_STEP_EXECUTION CASCADE");
        jdbcTemplate.execute("DROP TABLE IF EXISTS BATCH_JOB_EXECUTION CASCADE");
        jdbcTemplate.execute("DROP TABLE IF EXISTS BATCH_JOB_INSTANCE CASCADE");

        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS BATCH_JOB_INSTANCE  ( JOB_INSTANCE_ID BIGINT  NOT NULL PRIMARY KEY, VERSION BIGINT , JOB_NAME VARCHAR(100) NOT NULL, JOB_KEY VARCHAR(32) NOT NULL, constraint JOB_INST_UN unique (JOB_NAME, JOB_KEY));");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS BATCH_JOB_EXECUTION ( JOB_EXECUTION_ID BIGINT  NOT NULL PRIMARY KEY , VERSION BIGINT  ,JOB_INSTANCE_ID BIGINT NOT NULL,CREATE_TIME DATETIME NOT NULL,START_TIME DATETIME DEFAULT NULL ,END_TIME DATETIME DEFAULT NULL ,STATUS VARCHAR(10) ,EXIT_CODE VARCHAR(2500) ,EXIT_MESSAGE VARCHAR(2500) ,LAST_UPDATED DATETIME NULL ,JOB_CONFIGURATION_LOCATION VARCHAR(2500) NULL,constraint JOB_INST_EXEC_FK foreign key (JOB_INSTANCE_ID)references BATCH_JOB_INSTANCE(JOB_INSTANCE_ID) on delete cascade) ");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS BATCH_STEP_EXECUTION (STEP_EXECUTION_ID BIGINT  NOT NULL PRIMARY KEY ,VERSION BIGINT NOT NULL,STEP_NAME VARCHAR(100) NOT NULL,JOB_EXECUTION_ID BIGINT NOT NULL,START_TIME DATETIME NOT NULL ,END_TIME DATETIME DEFAULT NULL ,STATUS VARCHAR(10) ,COMMIT_COUNT BIGINT ,READ_COUNT BIGINT ,FILTER_COUNT BIGINT ,WRITE_COUNT BIGINT ,READ_SKIP_COUNT BIGINT ,WRITE_SKIP_COUNT BIGINT ,PROCESS_SKIP_COUNT BIGINT ,ROLLBACK_COUNT BIGINT ,EXIT_CODE VARCHAR(2500) ,EXIT_MESSAGE VARCHAR(2500) ,LAST_UPDATED DATETIME NULL ,constraint JOB_EXEC_STEP_FK foreign key (JOB_EXECUTION_ID)references BATCH_JOB_EXECUTION(JOB_EXECUTION_ID) on delete cascade)");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS BATCH_STEP_EXECUTION_CONTEXT (STEP_EXECUTION_ID BIGINT NOT NULL PRIMARY KEY,SHORT_CONTEXT VARCHAR(2500) NOT NULL,SERIALIZED_CONTEXT LONGTEXT ,constraint STEP_EXEC_CTX_FK foreign key (STEP_EXECUTION_ID)references BATCH_STEP_EXECUTION(STEP_EXECUTION_ID) on delete cascade)");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS BATCH_JOB_EXECUTION_PARAMS  (JOB_EXECUTION_ID BIGINT NOT NULL,TYPE_CD VARCHAR(6) NOT NULL,KEY_NAME VARCHAR(100) NOT NULL,STRING_VAL VARCHAR(250),DATE_VAL DATETIME,LONG_VAL BIGINT,DOUBLE_VAL DOUBLE PRECISION,IDENTIFYING CHAR(1) NOT NULL,constraint JOB_EXEC_PARAMS_FK foreign key (JOB_EXECUTION_ID)references BATCH_JOB_EXECUTION(JOB_EXECUTION_ID))");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS BATCH_JOB_EXECUTION_CONTEXT (JOB_EXECUTION_ID BIGINT NOT NULL PRIMARY KEY,SHORT_CONTEXT VARCHAR(2500) NULL,SERIALIZED_CONTEXT LONGTEXT NULL)");

        jdbcTemplate.execute("DROP TABLE IF EXISTS batch_job_seq");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS batch_job_seq (id BIGINT(20) NOT NULL AUTO_INCREMENT,PRIMARY KEY (id))");
        jdbcTemplate.execute("INSERT IGNORE INTO batch_job_seq (id) VALUES (1)");

        jdbcTemplate.execute("DROP TABLE IF EXISTS batch_job_execution_seq");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS batch_job_execution_seq (id BIGINT(20) NOT NULL AUTO_INCREMENT,PRIMARY KEY (id))");
        jdbcTemplate.execute("INSERT IGNORE INTO batch_job_execution_seq (id) VALUES (1)");

        jdbcTemplate.execute("DROP TABLE IF EXISTS batch_step_execution_seq");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS batch_step_execution_seq (id BIGINT(20) NOT NULL AUTO_INCREMENT,PRIMARY KEY (id))");
        jdbcTemplate.execute("INSERT IGNORE INTO batch_step_execution_seq (id) VALUES (1)");

        if (organizations == null){
            organizations = new Organizations(BigInteger.ONE, DefaultOrganization, true);
            organizationDAO.save(organizations);
        }
        if (users == null){
            users = new Users(BigInteger.ONE, DefaultUsername, passwordEncoder.encode(DefaultUserPassword),Constants.ADMIN, true, BigInteger.ONE);
            users.setEmail(DefaultAdminEmail);
            usersDAO.save(users);
        }
        if (superAdmin == null){
            superAdmin = new SuperAdmins(BigInteger.ONE, DefaultSuperAdminName, passwordEncoder.encode(DefaultSuperAdminPassword));
            superAdminsDAO.save(superAdmin);
        }
        System.out.println("Default user details : UserName : " + users.getUsername() + " Password : " + users.getPassword() + " Organization : " + organizations.getName());
        System.out.println("Default user details : UserName : " + users.getUsername() + " Password : " + users.getPassword());
    }

    @Cacheable(sync = true)
    public String testCache(){
        System.out.println("Test cache miss");
        return "test";
    }
}
